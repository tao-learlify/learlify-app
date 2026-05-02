# 🎯 Backend Task: Implementar 2 Endpoints para Progress Tracking

## Context
El frontend ya está listo con hooks, API layer y UI completa. Solo faltan estos 2 endpoints para activar la funcionalidad de seguimiento en tiempo real.

---

## 📍 Endpoint 1: Actualizar progreso mid-section

```
PUT /api/v1/courses/:courseId/sections/:sectionIndex/progress
```

### Request Body
```json
{
  "courseId": 1,
  "sectionIndex": 1,
  "xp": 120,
  "progressPercent": 0.45,
  "exercisesCompleted": 9,
  "lastAccessedAt": "2024-01-15T14:32:05Z"
}
```

**Nota:** `courseId` y `sectionIndex` van tanto en la URL como en el body para validación.

### Params
- `courseId` (path) — ID del curso del usuario
- `sectionIndex` (path) — Número de sección (1-6, **1-based**)

### Response 200 OK
```json
{
  "success": true,
  "message": "Progress updated successfully",
  "advance": {
    "id": "user-123-course-1",
    "currentSectionIndex": 1,
    "sections": {
      "1": {
        "xp": 120,
        "progressPercent": 0.45,
        "exercisesCompleted": 9,
        "completed": false,
        "lastAccessedAt": "2024-01-15T14:32:05Z"
      }
    },
    "updatedAt": "2024-01-15T14:32:05Z"
  }
}
```

### Errores
- `400` — sectionIndex inválido (debe ser 1-6)
- `401` — Token inválido o ausente
- `404` — Course no encontrado

### Lógica
1. Validar que `sectionIndex` esté entre 1 y 6
2. **UPSERT** en `advance.sections[sectionIndex]` (crear si no existe)
3. Actualizar `xp`, `progressPercent`, `exercisesCompleted`, `lastAccessedAt`
4. **NO** modificar `currentSectionIndex` (eso lo hace el endpoint #2)
5. Devolver el objeto `advance` completo actualizado

---

## 📍 Endpoint 2: Completar sección (auto-advance)

```
POST /api/v1/courses/:courseId/sections/:sectionIndex/complete
```

### Request Body
```json
{
  "courseId": 1,
  "sectionIndex": 1,
  "xp": 500,
  "examScore": 92,
  "completedAt": "2024-01-15T15:10:00Z"
}
```

**Nota:** `courseId` y `sectionIndex` van tanto en la URL como en el body para validación.

### Params
- `courseId` (path) — ID del curso del usuario
- `sectionIndex` (path) — Número de sección que se acaba de completar

### Response 200 OK
```json
{
  "success": true,
  "message": "Section completed. Advancing to next section.",
  "advance": {
    "id": "user-123-course-1",
    "currentSectionIndex": 2,
    "sections": {
      "1": {
        "xp": 500,
        "completed": true,
        "completedAt": "2024-01-15T15:10:00Z",
        "examScore": 92,
        "progressPercent": 1.0
      },
      "2": {
        "xp": 0,
        "completed": false,
        "progressPercent": 0
      }
    },
    "updatedAt": "2024-01-15T15:10:00Z"
  }
}
```

### Lógica
1. Validar que `sectionIndex` sea válido
2. Marcar `sections[sectionIndex].completed = true`
3. Guardar `xp`, `examScore`, `completedAt`, `progressPercent: 1.0`
4. **AUTO-INCREMENTAR** `currentSectionIndex` (ejemplo: si completó sección 1 → `currentSectionIndex = 2`)
5. **OPCIONAL:** Crear entrada vacía para la siguiente sección (`sections[currentSectionIndex]`) con valores iniciales
6. Devolver el objeto `advance` completo actualizado

---

## 🔒 Seguridad
- Ambos endpoints requieren autenticación via Bearer token
- Validar que el `courseId` pertenece al usuario autenticado
- Validar que `sectionIndex` esté en rango válido (1-6)

---

## 📦 Data Model Actual (reference)

El objeto `advance` en la DB se ve así:

```json
{
  "id": "user-123-course-1",
  "userId": "user-123",
  "courseId": 1,
  "currentSectionIndex": 1,
  "sections": {
    "1": {
      "xp": 120,
      "progressPercent": 0.45,
      "exercisesCompleted": 9,
      "completed": false,
      "lastAccessedAt": "2024-01-15T14:32:05Z"
    }
  },
  "createdAt": "2024-01-10T10:00:00Z",
  "updatedAt": "2024-01-15T14:32:05Z"
}
```

---

## ✅ Checklist de implementación

- [ ] Endpoint 1: `PUT /api/v1/courses/:courseId/sections/:sectionIndex/progress`
  - [ ] Validación de auth
  - [ ] Validación de sectionIndex (1-6)
  - [ ] UPSERT en `advance.sections[sectionIndex]`
  - [ ] Response con advance completo
  
- [ ] Endpoint 2: `POST /api/v1/courses/:courseId/sections/:sectionIndex/complete`
  - [ ] Validación de auth
  - [ ] Marcar `completed: true`
  - [ ] Auto-incrementar `currentSectionIndex`
  - [ ] Response con advance completo

- [ ] Tests unitarios para ambos endpoints
- [ ] Tests de integración con frontend (curl manual está OK)

---

## 🧪 Testing rápido

Una vez implementados, puedes testear con:

```bash
# Test endpoint 1 (update progress)
curl -X PUT http://localhost:3100/api/v1/courses/1/sections/1/progress \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"courseId": 1, "sectionIndex": 1, "xp": 50, "progressPercent": 0.25, "exercisesCompleted": 5, "lastAccessedAt": "2024-01-15T14:00:00Z"}'

# Test endpoint 2 (complete section)
curl -X POST http://localhost:3100/api/v1/courses/1/sections/1/complete \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"courseId": 1, "sectionIndex": 1, "xp": 500, "examScore": 95, "completedAt": "2024-01-15T15:00:00Z"}'
```

---

## ⏱️ Tiempo estimado
**2-3 horas** (incluyendo tests y validación)

## 📚 Referencias
Ver especificaciones completas en: `/docs/BACKEND_REQUIREMENTS.md`
