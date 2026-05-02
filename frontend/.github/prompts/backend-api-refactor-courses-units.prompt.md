# Prompt: Refactorizar API de Cursos — Retornar 15 Unidades Planas

**Objetivo:** Transformar la respuesta de `/api/v1/courses?model=Aptis` para retornar un array plano de **15 unidades** con progreso integrado, en lugar del formato anidado actual.

**Impacto:** Simplifica el frontend, mejora el rendimiento y permite UI más clara con todas las unidades visibles a la vez.

---

## 🎯 Cambio Principal

### Endpoint
```
GET /api/v1/courses?model=Aptis&demo=false
```

### Respuesta Anterior (❌ Vieja)
```json
{
  "response": {
    "advance": [
      {
        "id": 61,
        "currentSectionIndex": 3,
        "sections": {
          "1": { "general": 100, "completed": true, "last": false },
          "2": { "general": 95, "completed": true, "last": false },
          "3": { "general": 30, "completed": false, "last": true },
          "4": { "general": 0, "completed": false, "last": false },
          ...
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

### Respuesta Nueva (✅ Plana)
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

## 📊 Mapeo de Datos

### Fuente: Tabla `advance.content` (JSON actual)

```json
{
  "1": { "general": 100, "completed": true, "last": false },
  "2": { "general": 95, "completed": true, "last": false },
  "3": { "general": 30, "completed": false, "last": true },
  "4": { "general": 0, "completed": false, "last": false }
}
```

### Transformación: `advance.content` → `units[]` (array plano)

| Campo Destino | Fuente | Lógica |
|---------------|--------|--------|
| **sectionIndex** | clave de objeto (string) | `parseInt(key)` — convierte "1" → 1 |
| **xp** | `content[key].general` | Copiar valor directo |
| **completed** | `content[key].completed` | Copiar valor directo |
| **completedAt** | *calculado* | Si `completed === true`, usar `advance.updatedAt` (timestamp); si `false`, null |
| **lastAccessed** | `content[key].last` | Renombrar: `last` → `lastAccessed` |
| **lastAccessedAt** | *calculado* | Si `lastAccessed === true`, usar `advance.updatedAt`; si `false`, null |

### Pseudocódigo

```javascript
const units = Object.entries(advance.content).map(([key, section]) => ({
  sectionIndex: parseInt(key),
  xp: section.general,
  completed: section.completed,
  completedAt: section.completed ? advance.updatedAt : null,
  lastAccessed: section.last,
  lastAccessedAt: section.last ? advance.updatedAt : null
})).sort((a, b) => a.sectionIndex - b.sectionIndex);

// Si advance.content está vacío (usuario nuevo):
const units = Array.from({ length: 15 }, (_, i) => ({
  sectionIndex: i + 1,
  xp: 0,
  completed: false,
  completedAt: null,
  lastAccessed: false,
  lastAccessedAt: null
}));
```

---

## 🔧 Implementación

### Paso 1: Verificar tabla `courses`

El curso "Aptis" debe tener exactamente **15 unidades**:

```sql
SELECT id, name, totalSections FROM courses WHERE name LIKE '%Aptis%';
-- Debe retornar: id=1, totalSections=15
```

Si no existe, crear:
```sql
INSERT INTO courses (order, modelId, totalSections, createdAt, updatedAt)
VALUES (1, 1, 15, NOW(), NOW());
```

### Paso 2: Actualizar endpoint `/api/v1/courses`

**Pseudo-código backend (Node.js/Express):**

```javascript
// GET /api/v1/courses?model=Aptis&demo=false
router.get('/courses', async (req, res) => {
  const { model } = req.query;
  const userId = req.user.id;

  // 1. Fetch course metadata
  const course = await Course.findOne({ name: model });
  if (!course) return res.status(404).json({ message: 'Course not found' });

  // 2. Fetch user's advance progress
  const advance = await Advance.findOne({
    userId,
    courseId: course.id
  });

  // 3. Transform advance.content → units[]
  let units = [];
  if (advance && advance.content && Object.keys(advance.content).length > 0) {
    // User has progress
    units = Object.entries(advance.content)
      .map(([key, section]) => ({
        sectionIndex: parseInt(key),
        xp: section.general || 0,
        completed: section.completed || false,
        completedAt: section.completed ? advance.updatedAt : null,
        lastAccessed: section.last || false,
        lastAccessedAt: section.last ? advance.updatedAt : null
      }))
      .sort((a, b) => a.sectionIndex - b.sectionIndex);
  } else {
    // User is new, no progress
    units = Array.from({ length: course.totalSections }, (_, i) => ({
      sectionIndex: i + 1,
      xp: 0,
      completed: false,
      completedAt: null,
      lastAccessed: false,
      lastAccessedAt: null
    }));
  }

  // 4. Fetch course views (CDN URL)
  const views = await View.findOne({ courseId: course.id });

  // 5. Return response
  res.json({
    response: {
      units,
      courses: [
        {
          id: course.id,
          name: course.name,
          totalSections: course.totalSections,
          model: course.model, // { id, name, color }
          views: {
            url: views.url,
            createdAt: views.createdAt
          }
        }
      ]
    },
    statusCode: 200
  });
});
```

---

## ✅ Validaciones

### 1. Cantidad de unidades
- ✅ Siempre retornar **15 unidades** (1-15)
- ✅ Si el usuario es nuevo, retornar 15 unidades con xp=0, completed=false
- ✅ No omitir unidades aunque no tenga progreso en ellas

### 2. Estado `last` (actual/lastAccessed)
- ✅ **Exactamente UNA** debe tener `lastAccessed: true`
- ✅ Si no hay progreso, `lastAccessed: false` para todas
- ✅ Corresponde al campo `advance.content[i].last`

### 3. Timestamps
- ✅ `completedAt` solo si `completed === true` (usar `advance.updatedAt`)
- ✅ `lastAccessedAt` solo si `lastAccessed === true` (usar `advance.updatedAt`)
- ✅ Formato ISO 8601: `2026-04-23T14:37:35.000Z`

### 4. Ordenamiento
- ✅ Array `units[]` debe estar ordenado por `sectionIndex` ascendente (1 → 15)

---

## 📦 Ejemplo Completo (Antes y Después)

### Usuario: demo, Progress: Secciones 1-3

#### ANTES (Viejo)
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
      { "id": 1, "name": "Aptis", "totalSections": 15, "views": { "url": "..." } }
    ]
  }
}
```

#### DESPUÉS (Nuevo)
```json
{
  "response": {
    "units": [
      { "sectionIndex": 1, "xp": 100, "completed": true, "completedAt": "2026-03-15T10:00:00Z", "lastAccessed": false, "lastAccessedAt": null },
      { "sectionIndex": 2, "xp": 95, "completed": true, "completedAt": "2026-03-16T14:30:00Z", "lastAccessed": false, "lastAccessedAt": null },
      { "sectionIndex": 3, "xp": 30, "completed": false, "completedAt": null, "lastAccessed": true, "lastAccessedAt": "2026-04-23T14:37:35Z" },
      { "sectionIndex": 4, "xp": 0, "completed": false, "completedAt": null, "lastAccessed": false, "lastAccessedAt": null },
      ...
      { "sectionIndex": 15, "xp": 0, "completed": false, "completedAt": null, "lastAccessed": false, "lastAccessedAt": null }
    ],
    "courses": [
      {
        "id": 1,
        "name": "Aptis",
        "totalSections": 15,
        "model": { "id": 1, "name": "Aptis", "color": "#EBB02C" },
        "views": { "url": "https://dkmwdxc6g4lk7.cloudfront.net/courses/aptis.json", "createdAt": "2020-02-17T15:40:44.000Z" }
      }
    ]
  },
  "statusCode": 200
}
```

---

## 🚀 Rollout

### Fase 1: Implementar
- [ ] Actualizar `/api/v1/courses` para retornar `units[]` plano
- [ ] Validar que siempre retorna 15 unidades
- [ ] Probar con usuarios nuevos (sin progreso) y usuarios con progreso

### Fase 2: Frontend consume nuevo formato
- [ ] `useCourseLearningPath.js` usa `units[]` en lugar de `advance.sections`
- [ ] `LearningPath` muestra 15 unidades correctamente
- [ ] Tests E2E pasan

### Fase 3: Limpiar (Futuro)
- [ ] Deprecar respuesta antigua (`advance`, `currentSectionIndex`)
- [ ] Remover campos redundantes

---

## 🔄 Backward Compatibility (Opcional)

Si necesitas soporte temporal para ambos formatos:

```javascript
// En la respuesta, incluir AMBOS
{
  "response": {
    // Nuevo formato (para frontend moderno)
    "units": [...],
    
    // Viejo formato (para clients que aún lo usan)
    "advance": [...],
    
    "courses": [...]
  }
}
```

---

## ❓ Preguntas para Backend

1. **¿Cuándo consideramos una unidad "completedAt"?**
   - ¿Cuando `completed === true`?
   - ¿Hay un timestamp específico guardado en BD?

2. **¿Los 15 cursos están garantizados en BD?**
   - ¿O hay que crearlos dinámicamente?

3. **¿Hay otros modelos además de "Aptis"?**
   - ¿"IELTS"? ¿Otro?
   - ¿Cómo determinar `totalSections` para cada modelo?

4. **¿Se puede testear en staging primero?**
   - Endpoint: `/api/v1/courses?model=Aptis&demo=false`

---

## 📋 Checklist de Implementación

- [ ] Endpoint `/api/v1/courses` retorna `units[]` plano
- [ ] Array siempre tiene 15 elementos (sectionIndex 1-15)
- [ ] `lastAccessed` exactamente para una unidad
- [ ] Timestamps en formato ISO 8601
- [ ] Usuario nuevo retorna 15 unidades con xp=0
- [ ] Usuario con progreso retorna datos transformados correctamente
- [ ] Ordenamiento por `sectionIndex` ascendente
- [ ] Tests unitarios pasan
- [ ] Tests E2E pasan en frontend

---

**Fin del prompt**
