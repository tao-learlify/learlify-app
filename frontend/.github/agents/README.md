# Design System Customizations

Este directorio contiene agentes, instrucciones y skills personalizados para mantener la consistencia del design system y la calidad del frontend en Learlify.

## 📦 Contenido

### 🤖 Agentes Personalizados

#### Design System Guardian

**Ubicación:** `.github/agents/design-system-guardian.agent.md`

Arquitecto del design system que protege la consistencia visual, accesibilidad y mantenibilidad.

**Cuándo usar:**

- Crear o modificar componentes UI
- Refactorizar código visual
- Implementar design tokens
- Asegurar consistencia visual
- Revisar soporte dark mode
- Mejorar accesibilidad

**Invocación:**

```
@design-system-guardian Necesito crear un componente Card
@design-system-guardian Revisa este botón y asegúrate de que sigue el design system
@design-system-guardian Tenemos 3 variantes de Modal similares, ayúdame a consolidarlas
```

---

#### Accessibility Auditor

**Ubicación:** `.github/agents/accessibility-auditor.agent.md`

Especialista en auditoría de accesibilidad WCAG 2.1 Level AA.

**Cuándo usar:**

- Auditar componentes para a11y
- Verificar compatibilidad WCAG
- Revisar ARIA attributes
- Validar navegación por teclado
- Analizar contraste de color
- Mejorar semántica HTML

**Invocación:**

```
@accessibility-auditor Audita src/components/Modal/Modal.js
@accessibility-auditor Este formulario necesita revisión de accesibilidad
@accessibility-auditor Verifica el contraste de colores en este componente
```

**Herramientas:** Solo lectura y búsqueda (no edita archivos)

---

#### Token Manager

**Ubicación:** `.github/agents/token-manager.agent.md`

Gestor especializado en design tokens (color, spacing, typography, radius).

**Cuándo usar:**

- Crear design tokens
- Refactorizar hardcoded values
- Definir estrategia dark mode
- Documentar convenciones de tokens
- Gestionar escalas de color/spacing/tipografía

**Invocación:**

```
@token-manager Necesito tokens para un sistema de alertas
@token-manager Refactoriza este componente para usar tokens en lugar de hex
@token-manager Cómo debo nombrar tokens para estados de éxito/error/warning
```

---

### 📋 Instrucciones Automáticas

#### React Component Guidelines

**Ubicación:** `.github/instructions/react-components.instructions.md`

Reglas que se **aplican automáticamente** cuando trabajas en componentes React.

**Se activa para:**

- `src/components/**/*.{js,jsx}`
- `src/views/**/*.{js,jsx}`

**No necesitas invocar nada.** Copilot carga estas reglas automáticamente.

**Qué refuerza:**

- Pre-flight checks (buscar componentes existentes)
- Uso de semantic tokens
- Consistencia visual
- Dark mode support
- Accesibilidad
- Naming conventions

---

### 🛠️ Skills

#### Component Scaffold

**Ubicación:** `.github/skills/component-scaffold/`

Genera estructura completa de componente con tests, estilos, docs y barrel exports.

**Cuándo usar:**

- Crear componente shared nuevo
- Generar boilerplate con best practices
- Inicializar componente con tests incluidos

**Invocación:**

```
/component-scaffold Badge
/component-scaffold AlertCard
```

**Qué genera:**

```
src/components/{ComponentName}/
├── index.js
├── {ComponentName}.js
├── {ComponentName}.module.scss
├── {ComponentName}.test.js
└── README.md
```

Incluye:

- Semantic tokens
- Dark mode support
- Accessibility
- PropTypes
- JSDoc
- Tests básicos
- Documentación

---

## 🎯 Flujos de Trabajo Recomendados

### Crear un componente nuevo

**Opción 1: Scaffold + Customización**

```
1. /component-scaffold MyComponent
2. @design-system-guardian Revisa el componente generado y ajústalo
3. @accessibility-auditor Audita el resultado
```

**Opción 2: Desde cero con guardián**

```
@design-system-guardian Crea un componente Tooltip en src/components/
```

---

### Refactorizar componente existente

```
1. @design-system-guardian Analiza src/components/Button.js
2. @token-manager Refactoriza los colores hardcoded a tokens
3. @accessibility-auditor Revisa a11y después del refactor
```

---

### Auditoría de accesibilidad

```
1. @accessibility-auditor Audita src/components/Modal/
2. [Aplicar fixes recomendados]
3. @accessibility-auditor Verifica los cambios
```

---

### Definir tokens para nueva feature

```
1. @token-manager Necesito tokens para un sistema de badges de estado
2. [Implementar tokens sugeridos]
3. @design-system-guardian Usa estos tokens en el componente Badge
```

---

## 🔧 Configuración Realizada

### Agentes (`.github/agents/`)

- ✅ Design System Guardian - Arquitecto UI
- ✅ Accessibility Auditor - Especialista a11y
- ✅ Token Manager - Gestor de tokens

### Instrucciones (`.github/instructions/`)

- ✅ React Components - Reglas automáticas para componentes

### Skills (`.github/skills/`)

- ✅ Component Scaffold - Generador de estructura

---

## 📚 Recursos Adicionales

### Design Tokens Reference

**Colores semánticos:**

- `--color-bg-page`, `--color-bg-surface`, `--color-bg-muted`
- `--color-text-primary`, `--color-text-secondary`
- `--color-border-default`, `--color-border-strong`
- `--color-action-primary`, `--color-action-primary-hover`

**Spacing:**

- `--spacing-xs` (4px), `--spacing-sm` (8px), `--spacing-md` (16px)
- `--spacing-lg` (24px), `--spacing-xl` (32px)

**Border Radius:**

- `--radius-sm`, `--radius-md`, `--radius-lg`, `--radius-xl`
- `--radius-pill`, `--radius-circle`

**Typography:**

- Font sizes: `--font-size-xs` a `--font-size-3xl`
- Font weights: `--font-weight-normal`, `--font-weight-medium`, etc.

### Principios del Design System

1. **Reutilización antes que creación**
2. **Design system first**
3. **Componentización real**
4. **Dark mode accountability**
5. **Accesibilidad como criterio de calidad**
6. **Consistencia sobre ocurrencias**

### Personalidad Visual

- Clara, amigable, optimista
- Muy redondeada, consistente
- Visualmente motivadora
- Moderna, educativa
- Jerarquía evidente
- Superficies suaves
- CTAs notorios

---

## 🚀 Próximos Pasos Sugeridos

1. **Crear inventario de componentes** - Documentar todos los componentes existentes
2. **Tokens audit** - Identificar valores hardcoded y migrar a tokens
3. **Accessibility sweep** - Auditar todos los componentes principales
4. **Storybook integration** - Si no existe, integrar para documentar componentes
5. **Dark mode implementation** - Implementar tema oscuro completo
6. **Component consolidation** - Eliminar componentes duplicados

---

## 💡 Tips

- Usa `@` en el chat para ver la lista de agentes disponibles
- Usa `/` en el chat para ver skills disponibles
- Las instrucciones se cargan automáticamente, no necesitas invocarlas
- Combina agentes en secuencia para workflows complejos
- El agent `@design-system-guardian` es tu punto de entrada principal

---

## 📝 Mantenimiento

Este sistema de customizaciones debe evolucionar con el proyecto:

- Actualiza los tokens cuando el diseño cambie
- Agrega nuevas reglas a las instrucciones según aparezcan patrones
- Crea nuevos agentes si surgen roles especializados
- Revisa y consolida customizaciones cada trimestre

Para modificar cualquier customización:

1. Edita el archivo `.agent.md`, `.instructions.md`, o `SKILL.md`
2. Los cambios se aplican inmediatamente (no requiere restart de VS Code)
3. Prueba con un prompt simple para verificar
