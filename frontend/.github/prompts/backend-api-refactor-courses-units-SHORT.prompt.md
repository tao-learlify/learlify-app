# Backend API Refactor: Cursos con Unidades Planas

## 📋 Resumen Ejecutivo

**Cambio:** El endpoint `/api/v1/courses?model=Aptis` debe retornar un array **plano de 15 unidades** en lugar del formato anidado actual.

**Por qué:**
- ✅ Frontend más simple (itera array en lugar de buscar en objeto)
- ✅ UI consistente (siempre 15 unidades visibles)
- ✅ Performance mejorado (sin transformaciones en cliente)
- ✅ Preparar para display de learning path completo

**Tiempo estimado:** 2-3 horas

---

## 🔄 Cambio de Respuesta

### ANTES ❌
```json
{
  "response": {
    "advance": [
      {
        "currentSectionIndex": 3,
        "sections": {
          "1": { "general": 100, "completed": true, "last": false },
          "2": { "general": 95, "completed": true, "last": false },
          "3": { "general": 30, "completed": false, "last": true }
        }
      }
    ],
    "courses": [...]
  }
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
      ... (secciones 4-15 con xp=0, completed=false)
    ],
    "courses": [...]
  }
}
```

---

## 🗺️ Mapeo de Transformación

```
advance.content["1"].general      →  units[0].xp
advance.content["1"].completed    →  units[0].completed
advance.content["1"].last         →  units[0].lastAccessed
advance.updatedAt (if completed)  →  units[0].completedAt
advance.updatedAt (if last)       →  units[0].lastAccessedAt
```

---

## ⚙️ Pseudocódigo

```javascript
// Entrada: advance record
const transformToUnits = (advance, totalSections = 15) => {
  if (!advance.content || Object.keys(advance.content).length === 0) {
    // Usuario nuevo: retornar 15 unidades vacías
    return Array.from({ length: totalSections }, (_, i) => ({
      sectionIndex: i + 1,
      xp: 0,
      completed: false,
      completedAt: null,
      lastAccessed: false,
      lastAccessedAt: null
    }));
  }

  // Usuario con progreso: transformar
  const units = Object.entries(advance.content)
    .map(([key, section]) => ({
      sectionIndex: parseInt(key),
      xp: section.general || 0,
      completed: section.completed || false,
      completedAt: section.completed ? advance.updatedAt : null,
      lastAccessed: section.last || false,
      lastAccessedAt: section.last ? advance.updatedAt : null
    }))
    .sort((a, b) => a.sectionIndex - b.sectionIndex);

  // Rellenar huecos (si faltan secciones): secciones no tocadas
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

## 🧪 Testing

### Test 1: Usuario nuevo (sin progreso)
```bash
GET /api/v1/courses?model=Aptis&demo=false
Authorization: Bearer <token_new_user>

Expected:
- units.length === 15
- Todos con xp: 0, completed: false, lastAccessed: false
```

### Test 2: Usuario con progreso (3 secciones)
```bash
GET /api/v1/courses?model=Aptis&demo=false
Authorization: Bearer <token_user_with_progress>

Expected:
- units.length === 15
- units[0].sectionIndex: 1, xp: 100, completed: true
- units[1].sectionIndex: 2, xp: 95, completed: true
- units[2].sectionIndex: 3, xp: 30, completed: false, lastAccessed: true
- units[3-14].sectionIndex: 4-15, xp: 0, completed: false, lastAccessed: false
```

---

## 📝 Cambios Necesarios

### En el controlador `/api/v1/courses`

```javascript
// PSEUDO-CÓDIGO
router.get('/courses', async (req, res) => {
  const { model } = req.query;
  const userId = req.user.id;

  const course = await Course.findOne({ name: model });
  const advance = await Advance.findOne({ userId, courseId: course.id });

  // NUEVO: Transformar a units[]
  const units = transformToUnits(advance, course.totalSections);

  res.json({
    response: {
      units,  // ← NUEVO
      courses: [...]
    },
    statusCode: 200
  });
});
```

---

## ✅ Validaciones Clave

1. **Siempre 15 unidades** (1-15), nunca menos
2. **Un único `lastAccessed: true`** (si hay progreso)
3. **`completedAt` solo si `completed === true`**
4. **Ordenado por `sectionIndex` ascendente**
5. **Timestamps en ISO 8601**

---

## 🚨 Casos Edge

| Caso | Comportamiento |
|------|----------------|
| Usuario nuevo | Retornar 15 unidades con xp=0 |
| Usuario sin registrar en curso | Retornar 15 unidades con xp=0 |
| Usuario completó todo (15/15) | Todas con `completed: true` |
| Huecos en progreso (ej: "1,2,3" solo) | Rellenar "4-15" con xp=0 |
| Usuario está en sección 5 | `lastAccessed: true` para sectionIndex=5 |

---

## 🎯 Deliverables

- [ ] Endpoint `/api/v1/courses?model=Aptis` retorna `units[]`
- [ ] 15 unidades siempre presentes
- [ ] Transformación de `advance.content` correcta
- [ ] Tests unitarios pasan
- [ ] Tests E2E frontend pasan

---

## 📞 Preguntas

1. ¿`completedAt` siempre es `advance.updatedAt`?
2. ¿O hay timestamp específico de completion guardado?
3. ¿Hay otros modelos además de "Aptis" y "IELTS"?
4. ¿Se puede testear en staging?

---

**Fin**
