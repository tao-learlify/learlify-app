# 🔍 Análisis: Progress Tracking vs API Existente

## ❌ Problema Identificado

Estamos intentando llamar a endpoints que **NO EXISTEN** en el backend:

```
❌ PUT /api/v1/courses/:courseId/sections/:sectionIndex/progress
❌ POST /api/v1/courses/:courseId/sections/:sectionIndex/complete
```

---

## ✅ API Backend Existente

Según `docs/advance-api.md`, el backend ya tiene:

### GET /api/v1/advance?course=X
Obtiene el progreso del usuario

**Response:**
```json
{
  "response": {
    "id": 1,
    "userId": 123,
    "courseId": 456,
    "content": {
      "1": {
        "completed": false,
        "general": 5,
        "last": true
      },
      "2": {
        "completed": true,
        "general": 10,
        "last": false
      }
    }
  }
}
```

### PUT /api/v1/advance
Actualiza el progreso del usuario

**Request:**
```json
{
  "courseId": 456,
  "unit": 3,
  "last": 15,
  "completed": true
}
```

---

## 🔄 Mapeo de Conceptos

| Nuestro Sistema | API Existente | Notas |
|-----------------|---------------|-------|
| `sectionIndex` | `unit` | Mapeo directo 1:1 |
| `xp` acumulado | `general` | Número de progreso general |
| `progressPercent` | — | No existe en API, se calcula en frontend |
| `completed` | `completed` | Mapeo directo |
| `sections` | `content` | Estructura similar, diferentes keys |
| `currentSectionIndex` | `unit` donde `last: true` | Último accedido |

---

## ✅ Solución: Adaptar Frontend a API Existente

En lugar de esperar nuevos endpoints, vamos a:

### 1. Modificar `useProgressTracking.js`

**Antes (endpoints inexistentes):**
```javascript
api.courses.updateSectionProgress(courseId, sectionIndex, {
  courseId,
  sectionIndex,
  xp,
  progressPercent,
  exercisesCompleted
})
```

**Después (API existente):**
```javascript
api.courses.updateAdvance({
  courseId,
  unit: sectionIndex,
  last: xp,  // Usar XP como marcador de progreso
  completed: false  // Solo true cuando se completa la sección
})
```

### 2. Para Completion de Sección

**Antes:**
```javascript
api.courses.completeSectionProgress(courseId, sectionIndex, {
  xp: finalXp,
  examScore,
  completedAt
})
```

**Después:**
```javascript
api.courses.updateAdvance({
  courseId,
  unit: sectionIndex,
  last: finalXp,
  completed: true  // Marca como completada
})
```

---

## 📊 Estructura de Datos Adaptada

### Frontend Redux State (actual)
```javascript
advance: {
  data: [{
    id: 1,
    courseId: 456,
    content: {
      "1": { completed: true, general: 100, last: false },
      "2": { completed: false, general: 45, last: true }
    }
  }]
}
```

### Cómo Interpretar
- `content["2"].last: true` → Es la sección actual (currentSectionIndex)
- `content["2"].general: 45` → XP acumulado en esa sección
- `content["1"].completed: true` → Sección completada
- `progressPercent` se calcula: `general / totalXPPorSeccion`

---

## 🎯 Ventajas de Esta Solución

✅ **Sin cambios en backend** - Usa API existente y probada  
✅ **Compatible** - No rompe funcionalidad actual  
✅ **Inmediato** - Funciona ahora mismo  
✅ **Escalable** - Cuando backend implemente endpoints dedicados, cambiar es trivial  

---

## ⚡ Cambios Necesarios

### Archivos a Modificar:

1. **`src/hooks/useProgressTracking.js`**
   - Cambiar `updateSectionProgress` → `updateAdvance`
   - Cambiar `completeSectionProgress` → `updateAdvance`
   - Adaptar estructura de datos

2. **`src/hooks/useLearningPathWithSchema.js`**
   - Ya usa `advance.data[0].content` ✅
   - Adaptar para leer `general` como XP
   - Calcular `progressPercent` localmente

3. **`BACKEND_PROGRESS_ENDPOINTS.md`**
   - Marcar como "Opcional - Mejora Futura"
   - Documentar que frontend usa API existente

---

## 🧪 Testing con API Existente

```bash
# Actualizar progreso (sección en proceso)
curl -X PUT http://localhost:3100/api/v1/advance \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{
    "courseId": 1,
    "unit": 2,
    "last": 45,
    "completed": false
  }'

# Completar sección (auto-avanza)
curl -X PUT http://localhost:3100/api/v1/advance \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{
    "courseId": 1,
    "unit": 2,
    "last": 100,
    "completed": true
  }'
```

---

## 🚀 Próximos Pasos

1. ✅ **Adaptar `useProgressTracking.js`** (30 min)
2. ✅ **Testear con API existente** (15 min)
3. ✅ **Verificar UI se actualiza** (10 min)
4. ⏸️ **Esperar endpoints dedicados** (opcional, futuro)

---

## 📝 Notas Técnicas

- El campo `last` en la API indica cuál es la unidad actualmente activa
- Solo una unidad puede tener `last: true` a la vez
- El backend automáticamente marca `last: false` en todas las demás unidades
- `general` es un número flexible - podemos usarlo para XP, progreso, etc.
