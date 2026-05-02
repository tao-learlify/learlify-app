# Backend Refactor: API Cursos → Unidades Planas

## 🎯 Objetivo

Transformar el endpoint `/api/v1/courses?model=Aptis` para retornar un array **plano de 15 unidades** en lugar del formato anidado actual.

---

## 📊 Cambio de Respuesta

### ANTES ❌
```json
{
  "response": {
    "advance": [
      {
        "id": 61,
        "userId": 4,
        "courseId": 1,
        "currentSectionIndex": 3,
        "sections": {
          "1": { "general": 100, "completed": true, "last": false },
          "2": { "general": 95, "completed": true, "last": false },
          "3": { "general": 30, "completed": false, "last": true }
        }
      }
    ],
    "courses": [
      {
        "id": 1,
        "name": "Aptis Course",
        "totalSections": 15,
        "views": { "url": "https://..." }
      }
    ]
  },
  "statusCode": 200
}
```

### DESPUÉS ✅
```json
{
  "response": {
    "units": [
      {
        "sectionIndex": 1,
        "xp": 100,
        "completed": true,
        "completedAt": "2026-03-15T10:00:00.000Z",
        "lastAccessed": false,
        "lastAccessedAt": null
      },
      {
        "sectionIndex": 2,
        "xp": 95,
        "completed": true,
        "completedAt": "2026-03-16T14:30:00.000Z",
        "lastAccessed": false,
        "lastAccessedAt": null
      },
      {
        "sectionIndex": 3,
        "xp": 30,
        "completed": false,
        "completedAt": null,
        "lastAccessed": true,
        "lastAccessedAt": "2026-04-23T14:37:35.000Z"
      },
      {
        "sectionIndex": 4,
        "xp": 0,
        "completed": false,
        "completedAt": null,
        "lastAccessed": false,
        "lastAccessedAt": null
      },
      ...
      {
        "sectionIndex": 15,
        "xp": 0,
        "completed": false,
        "completedAt": null,
        "lastAccessed": false,
        "lastAccessedAt": null
      }
    ],
    "courses": [
      {
        "id": 1,
        "name": "Aptis Course",
        "totalSections": 15,
        "model": { "id": 1, "name": "Aptis", "color": "#EBB02C" },
        "views": {
          "url": "https://dkmwdxc6g4lk7.cloudfront.net/courses/aptis.json",
          "createdAt": "2020-02-17T15:40:44.000Z"
        }
      }
    ]
  },
  "statusCode": 200
}
```

---

## 🗺️ Mapeo de Transformación

| Campo Backend | → | Campo Frontend |
|---|---|---|
| `advance.content["1"].general` | → | `units[0].xp` |
| `advance.content["1"].completed` | → | `units[0].completed` |
| `advance.content["1"].last` | → | `units[0].lastAccessed` |
| `advance.updatedAt` (si completed) | → | `units[0].completedAt` |
| `advance.updatedAt` (si last) | → | `units[0].lastAccessedAt` |

---

## ⚙️ Pseudocódigo de Implementación

```javascript
const transformToUnits = (advance, totalSections = 15) => {
  // Si usuario es nuevo o sin progreso, retornar 15 unidades vacías
  if (!advance.content || Object.keys(advance.content).length === 0) {
    return Array.from({ length: totalSections }, (_, i) => ({
      sectionIndex: i + 1,
      xp: 0,
      completed: false,
      completedAt: null,
      lastAccessed: false,
      lastAccessedAt: null
    }));
  }

  // Transformar advance.content → units[]
  let units = Object.entries(advance.content)
    .map(([key, section]) => ({
      sectionIndex: parseInt(key),
      xp: section.general || 0,
      completed: section.completed || false,
      completedAt: section.completed ? advance.updatedAt : null,
      lastAccessed: section.last || false,
      lastAccessedAt: section.last ? advance.updatedAt : null
    }))
    .sort((a, b) => a.sectionIndex - b.sectionIndex);

  // Rellenar huecos (secciones sin tocar por usuario)
  for (let i = 1; i <= totalSections; i++) {
    if (!units.find(u => u.sectionIndex === i)) {
      units.push({
        sectionIndex: i,
        xp: 0,
        completed: false,
        completedAt: null,
        lastAccessed: false,
        lastAccessedAt: null
      });
    }
  }

  return units.sort((a, b) => a.sectionIndex - b.sectionIndex);
};
```

---

## 📝 Cambio en el Controlador

```javascript
// Endpoint: GET /api/v1/courses?model=Aptis&demo=false
router.get('/courses', async (req, res) => {
  const { model } = req.query;
  const userId = req.user.id;

  // 1. Fetch course metadata
  const course = await Course.findOne({ name: model });
  if (!course) {
    return res.status(404).json({ 
      message: 'Course not found',
      statusCode: 404
    });
  }

  // 2. Fetch user's progress
  const advance = await Advance.findOne({
    userId,
    courseId: course.id
  });

  // 3. Transform advance.content → units[] (NUEVO)
  const units = transformToUnits(advance, course.totalSections);

  // 4. Fetch course views (CDN URL)
  const views = await View.findOne({ courseId: course.id });

  // 5. Build response
  const response = {
    units,  // ← NUEVO
    courses: [
      {
        id: course.id,
        name: course.name,
        totalSections: course.totalSections,
        model: {
          id: course.model.id,
          name: course.model.name,
          color: course.model.color
        },
        views: {
          url: views?.url || null,
          createdAt: views?.createdAt || null
        }
      }
    ]
  };

  return res.json({
    message: 'Courses Obtained Successfully',
    response,
    statusCode: 200
  });
});
```

---

## ✅ Validaciones Requeridas

1. **Cantidad de unidades:** Siempre exactamente **15** (sectionIndex 1-15)
2. **Estado lastAccessed:** Exactamente **UNA** con `lastAccessed: true` (o ninguna si usuario es nuevo)
3. **Timestamps:** Si `completed === true`, incluir `completedAt`; si `lastAccessed === true`, incluir `lastAccessedAt`
4. **Ordenamiento:** Array siempre ordenado por `sectionIndex` ascendente
5. **Formato:** Timestamps en ISO 8601 (ej: `2026-04-23T14:37:35.000Z`)

---

## 🧪 Casos de Prueba

### Test 1: Usuario Nuevo
```bash
GET /api/v1/courses?model=Aptis&demo=false
Authorization: Bearer <token_usuario_nuevo>

Expected Response:
{
  "units": [
    { "sectionIndex": 1, "xp": 0, "completed": false, "completedAt": null, "lastAccessed": false, "lastAccessedAt": null },
    { "sectionIndex": 2, "xp": 0, "completed": false, "completedAt": null, "lastAccessed": false, "lastAccessedAt": null },
    ...
    { "sectionIndex": 15, "xp": 0, "completed": false, "completedAt": null, "lastAccessed": false, "lastAccessedAt": null }
  ],
  "courses": [...]
}

Verificar:
✓ units.length === 15
✓ Todos con xp: 0, completed: false
✓ Ninguno con lastAccessed: true
```

### Test 2: Usuario con Progreso (3 secciones)
```bash
GET /api/v1/courses?model=Aptis&demo=false
Authorization: Bearer <token_usuario_con_progreso>

Expected Response:
{
  "units": [
    { "sectionIndex": 1, "xp": 100, "completed": true, "completedAt": "2026-03-15T10:00:00.000Z", "lastAccessed": false, "lastAccessedAt": null },
    { "sectionIndex": 2, "xp": 95, "completed": true, "completedAt": "2026-03-16T14:30:00.000Z", "lastAccessed": false, "lastAccessedAt": null },
    { "sectionIndex": 3, "xp": 30, "completed": false, "completedAt": null, "lastAccessed": true, "lastAccessedAt": "2026-04-23T14:37:35.000Z" },
    { "sectionIndex": 4, "xp": 0, "completed": false, "completedAt": null, "lastAccessed": false, "lastAccessedAt": null },
    ...
    { "sectionIndex": 15, "xp": 0, "completed": false, "completedAt": null, "lastAccessed": false, "lastAccessedAt": null }
  ],
  "courses": [...]
}

Verificar:
✓ units.length === 15
✓ sectionIndex 1-2: completed: true
✓ sectionIndex 3: lastAccessed: true (y es la única)
✓ sectionIndex 4-15: xp: 0, completed: false
✓ Ordenado por sectionIndex ascendente
```

### Test 3: Usuario Completó Todo
```bash
GET /api/v1/courses?model=Aptis&demo=false
Authorization: Bearer <token_usuario_completo>

Expected Response:
{
  "units": [
    { "sectionIndex": 1, "xp": 100, "completed": true, "completedAt": "...", "lastAccessed": false, "lastAccessedAt": null },
    { "sectionIndex": 2, "xp": 95, "completed": true, "completedAt": "...", "lastAccessed": false, "lastAccessedAt": null },
    ...
    { "sectionIndex": 15, "xp": 90, "completed": true, "completedAt": "...", "lastAccessed": false, "lastAccessedAt": null }
  ],
  "courses": [...]
}

Verificar:
✓ Todos con completed: true
✓ Todos con completedAt != null
✓ Ninguno con lastAccessed: true (progreso completado)
```

---

## 🔍 Checklist de Implementación

- [ ] Crear función `transformToUnits(advance, totalSections)`
- [ ] Actualizar controlador GET `/api/v1/courses`
- [ ] Retornar `units[]` en lugar de `advance` anidado
- [ ] Validar que siempre hay 15 unidades
- [ ] Validar timestamps en ISO 8601
- [ ] Ejecutar Test 1 (usuario nuevo) → PASS
- [ ] Ejecutar Test 2 (usuario con progreso) → PASS
- [ ] Ejecutar Test 3 (usuario completo) → PASS
- [ ] Mantener `courses` en respuesta
- [ ] Mantener backward compatibility si es necesario (opcional)

---

## 📞 Preguntas Clarificadoras

1. **¿`completedAt` siempre es `advance.updatedAt`?**
   - ¿O hay un timestamp específico guardado cuando se completa?

2. **¿Los 15 cursos están garantizados en BD?**
   - ¿O se crean dinámicamente?

3. **¿Hay otros modelos además de "Aptis"?**
   - (ej: "IELTS", "Cambridge", etc.)
   - ¿Cómo se determina `totalSections` por modelo?

4. **¿Hay más endpoints que dependan de `advance.currentSectionIndex`?**
   - ¿O solo este endpoint?

---

## ⏱️ Estimado

**Tiempo de implementación:** 2-3 horas

---

**Fin del prompt**
