# 🔌 Integración Final: Conectar Progress Tracking en UnitView

## Estado Actual ✅

### Completado:
- ✅ Hooks creados: `useProgressTracking`, `useProgressPolling`
- ✅ API layer: `updateSectionProgress()`, `completeSectionProgress()`
- ✅ UI components: Progress rings y progress bars
- ✅ Polling iniciado en `ConnectedUnitView` (cada 5s)
- ✅ Handlers listos en `ConnectedUnitView`

### Pendiente:
- ⏳ Conectar handlers dentro de `UnitView` o `UnitFlow`
- ⏳ Backend debe implementar los 2 endpoints

---

## 📍 Próximo Paso: Integración en UnitView

### Ubicación del código
**Archivo:** `src/views/courses/unit/UnitView.tsx`

### Estrategia

`UnitView` ya tiene un sistema de progreso interno (`useUnitProgress`). La integración debe:

1. **Interceptar eventos de XP** cuando el usuario completa ejercicios
2. **Reportar al backend** cada vez que se gana XP o se completa sección
3. **Mantener el sistema local** (optimistic updates en UI)

---

## 🎯 Cambios Necesarios

### 1. Agregar Props a UnitViewProps

```typescript
// src/views/courses/unit/UnitView.tsx
interface UnitViewProps {
  unit: Unit;
  onComplete?: () => void;
  onNextUnit?: () => void;
  onBackToCourse?: () => void;
  
  // 🆕 Progress tracking callbacks
  onProgressUpdate?: (xp: number, exercisesCompleted: number) => void;
  onSectionComplete?: (finalXp: number, examScore: number) => void;
}
```

### 2. Modificar handleXP para reportar progreso

```typescript
// Ubicación: dentro de UnitView component
const handleXP = useCallback((xp: number) => {
  setFeedbackXP(xp);
  setFeedbackVisible(true);
  
  // 🆕 Report progress to backend
  if (onProgressUpdate) {
    const exercisesCompleted = progress.completedSectionIds?.length || 0;
    onProgressUpdate(xp, exercisesCompleted);
  }
}, [onProgressUpdate, progress.completedSectionIds]);
```

### 3. Calcular progressPercent

Necesitas calcular el porcentaje de progreso actual dentro de la sección:

```typescript
// Dentro del componente UnitView
const progressPercent = React.useMemo(() => {
  const totalSections = unit.sections?.length || 1;
  const completedSections = progress.completedSectionIds?.length || 0;
  return completedSections / totalSections;
}, [unit.sections, progress.completedSectionIds]);
```

Y luego pasarlo al hook:

```typescript
// En ConnectedUnitView.js
const {
  updateProgress,
  completeSection,
  ...
} = useProgressTracking(actualCourseId, currentSectionIndex)

// Llamar desde UnitView con el progressPercent calculado
updateProgress(xp, exercisesCompleted, progressPercent)
```

### 4. Detectar cuando se completa la sección

```typescript
// Dentro de UnitView, cuando progress.isUnitComplete cambia:
React.useEffect(() => {
  if (progress.isUnitComplete && onSectionComplete) {
    const finalXp = progress.totalXP || 0;
    const examScore = progress.lastExamScore || 0; // Necesitas trackear esto
    onSectionComplete(finalXp, examScore);
  }
}, [progress.isUnitComplete, onSectionComplete, progress.totalXP]);
```

---

## 🔄 Flujo Completo

```
Usuario completa ejercicio
  ↓
UnitFlow detecta completación
  ↓
UnitFlow.onXP(xp) → UnitView.handleXP(xp)
  ↓
handleXP llama a onProgressUpdate(xp, count)
  ↓
ConnectedUnitView.updateProgress(xp, count)
  ↓
useProgressTracking → PUT /api/v1/courses/:id/sections/:index/progress
  ↓
Backend actualiza advance
  ↓
useProgressPolling detecta cambio (cada 5s)
  ↓
Redux se actualiza
  ↓
LearningPath graph se re-renderiza con nuevo progreso ✨
```

---

## 🧪 Testing Manual

Una vez integrado:

1. **Abre DevTools → Network**
2. **Completa un ejercicio**
3. **Verifica**: Debe aparecer `PUT /api/v1/courses/1/sections/1/progress`
4. **Navega a CoursesOverview**
5. **Verifica**: El progress ring debe mostrar el progreso actualizado

---

## 🚨 Bloqueadores Actuales

### Backend no está listo
Los endpoints devuelven **404**:
- `PUT /api/v1/courses/:courseId/sections/:sectionIndex/progress`
- `POST /api/v1/courses/:courseId/sections/:sectionIndex/complete`

Hasta que el backend los implemente:
- Los hooks harán las llamadas pero fallarán con 404
- El progreso local (optimistic) seguirá funcionando en UI
- El polling no traerá cambios del servidor

**Solución temporal:** Agregar mock/stub para desarrollo local, o esperar backend.

---

## ✅ Checklist de Integración

- [ ] Agregar props `onProgressUpdate` y `onSectionComplete` a `UnitViewProps`
- [ ] Modificar `handleXP` para llamar a `onProgressUpdate`
- [ ] Calcular `progressPercent` dentro de `UnitView`
- [ ] Detectar `isUnitComplete` y llamar a `onSectionComplete`
- [ ] Descomentar las props en `ConnectedUnitView.js` líneas 185-187
- [ ] Testear con DevTools (Network tab)
- [ ] Verificar que el graph se actualiza correctamente

---

## 📚 Referencias

- **Backend Spec:** `BACKEND_PROGRESS_ENDPOINTS.md`
- **Hooks:** `src/hooks/useProgressTracking.js`, `src/hooks/useProgressPolling.js`
- **UI Components:** `src/components/ui/LearningPath/index.js`, `src/components/CourseUnitsGrid.js`
- **Full Docs:** `docs/INTEGRATION_PROGRESS_TRACKING.md`
