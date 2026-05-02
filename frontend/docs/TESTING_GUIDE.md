# Próximos Pasos - Sistema de Progreso

## ✅ Completado

1. **Hooks de seguimiento de progreso**
   - `useProgressTracking.js` - Actualiza progreso usando PUT /advance
   - `useProgressPolling.js` - Polling cada 5s para sincronización

2. **Adaptación de datos**
   - `useLearningPathWithSchema.js` - Convierte `content` → `sections` y encuentra `currentSectionIndex`
   - `ConnectedUnitView.js` - Extrae sección actual desde `last: true`

3. **Integración UI**
   - `UnitView.tsx` - Calcula progressPercent y llama handlers
   - `LearningPath` - Anillo SVG de progreso
   - `CourseUnitsGrid` - Barra de progreso lineal

4. **Build verification**
   - ✅ Compila sin errores en 26.11s
   - ✅ Sin errores de linting

## 🧪 Testing Manual

### Paso 1: Iniciar servidor dev
```bash
npm run dev
```

### Paso 2: Navegar a un curso
1. Abrir http://localhost:3000
2. Ir a cualquier curso
3. Entrar a una unidad

### Paso 3: Verificar actualizaciones de progreso
1. Completar un ejercicio
2. **Verificar:**
   - Aparece anillo de progreso alrededor de la unidad actual
   - Network tab muestra `PUT /api/v1/advance`
   - Request body tiene:
     ```json
     {
       "courseId": 123,
       "unit": 2,
       "last": 50,
       "completed": false
     }
     ```

### Paso 4: Verificar completado de sección
1. Completar todos los ejercicios de la unidad
2. **Verificar:**
   - Network tab muestra `PUT /api/v1/advance`
   - Request body tiene `"completed": true`
   - Graph se mueve automáticamente a la siguiente unidad
   - Unidad anterior se marca como completada

### Paso 5: Verificar sincronización
1. Esperar 5 segundos
2. **Verificar:**
   - Network tab muestra `GET /api/v1/advance`
   - Se hace automáticamente cada 5s

### Paso 6: Verificar multi-sesión
1. Abrir el mismo curso en otra pestaña
2. Completar un ejercicio en una pestaña
3. **Verificar:**
   - En 5s o menos, el progreso se sincroniza en la otra pestaña

## 🐛 Debugging

Si algo no funciona:

### No se actualiza el progreso
- Abrir Console → buscar errores de `PUT /advance`
- Verificar que `courseId` y `sectionIndex` son números válidos
- Revisar Network tab → ¿status 400/404/500?

### No se muestra el anillo de progreso
- Verificar que `unit.progressPercent > 0`
- Abrir React DevTools → buscar `LearningPath` component
- Revisar props: `units[X].progressPercent`

### No se completa la sección
- Verificar que `completedSections === totalSections`
- Revisar `UnitView.tsx` → useEffect de completion
- Console debe mostrar "Section completion detected"

### No se sincroniza entre pestañas
- Verificar polling: Network tab debe mostrar GET cada 5s
- Revisar Console → buscar errores de `fetchAdvanceThunk`

## 📝 Notas Importantes

### Estructura de datos backend
- `content["2"].last = true` → indica la unidad actual
- `content["2"].general` → progreso (0-100)
- `content["2"].completed` → si está completada

### Mapeo Frontend → Backend
- `sectionIndex` → `unit`
- `xp` → `last`
- `progressPercent` → calculado en frontend (no se envía)

### Limitaciones actuales
- No se persiste `examScore`
- No se guarda `lastAccessedAt`
- Solo un `general` por unidad (no por ejercicio)

## 📚 Documentación

Ver archivos:
- `docs/PROGRESS_TRACKING_FINAL.md` - Documentación completa
- `docs/PROGRESS_TRACKING_ANALYSIS.md` - Análisis de API mismatch
- `docs/advance-api.md` - Spec del backend API

## 🚀 Siguientes Mejoras (Opcionales)

Si el backend implementa endpoints dedicados:
- Agregar persistencia de exam scores
- Tracking granular por ejercicio
- Timestamps de última actividad
- Mejor analytics

Ver `docs/PROGRESS_TRACKING_FINAL.md` sección "Future Enhancements" para detalles.
