# 🚀 Backend: Refactor API Cursos (Ultra-Rápido)

## TL;DR
Cambiar `/api/v1/courses?model=Aptis` para retornar `units[]` **plano** en lugar de `advance.sections` (objeto).

---

## Cambio

### ANTES
```json
{
  "advance": [{ "currentSectionIndex": 3, "sections": {"1":{...}, "2":{...}} }],
  "courses": [...]
}
```

### DESPUÉS
```json
{
  "units": [
    { "sectionIndex": 1, "xp": 100, "completed": true, "lastAccessed": false, ... },
    { "sectionIndex": 2, "xp": 95, "completed": true, "lastAccessed": false, ... },
    { "sectionIndex": 3, "xp": 30, "completed": false, "lastAccessed": true, ... },
    ...
    (totales: 15 unidades, sectionIndex 1-15)
  ],
  "courses": [...]
}
```

---

## Mapeo

```
advance.content["1"].general     → units[0].xp
advance.content["1"].completed   → units[0].completed  
advance.content["1"].last        → units[0].lastAccessed
advance.updatedAt (si completed) → units[0].completedAt
advance.updatedAt (si lastAccessed) → units[0].lastAccessedAt
```

---

## Código

```javascript
const units = Object.entries(advance.content || {})
  .map(([key, s]) => ({
    sectionIndex: parseInt(key),
    xp: s.general || 0,
    completed: s.completed || false,
    completedAt: s.completed ? advance.updatedAt : null,
    lastAccessed: s.last || false,
    lastAccessedAt: s.last ? advance.updatedAt : null
  }))
  .sort((a,b) => a.sectionIndex - b.sectionIndex);

// Si vacío: rellenar con 15 unidades (xp=0, completed=false)
if (units.length === 0) {
  units = Array.from({length: 15}, (_, i) => ({
    sectionIndex: i + 1,
    xp: 0,
    completed: false,
    completedAt: null,
    lastAccessed: false,
    lastAccessedAt: null
  }));
}
```

---

## Validar

✅ **15 unidades siempre** (1-15)  
✅ **Un solo `lastAccessed: true`** (o ninguno si nuevo)  
✅ **`completedAt` null si completed=false**  
✅ **Ordenado por sectionIndex**  

---

## Testing

```
GET /api/v1/courses?model=Aptis&demo=false

Response: units.length === 15 ✓
```

---

**Tiempo:** ~1-2 hrs | **Priority:** Alta  
**Slack:** [link a este doc]
