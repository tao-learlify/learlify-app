# Course Content Schema — Design Report

**Fecha:** 2026-04-05
**Proyecto:** Learlify Frontend (`client@0.4.0`)
**Alcance:** Rediseño completo del schema de contenido de cursos

---

## 1. Objetivo

Rediseñar el schema de contenido de cursos desde una estructura JSON plana y legacy (`aptis-course.json`) hacia un sistema tipado, escalable y validable en TypeScript, capaz de soportar múltiples productos de examen (Aptis, IELTS, Cambridge, TOEFL) sin alterar el contenido educativo existente.

---

## 2. Problemas del Schema Legacy

| Problema | Ejemplo |
|----------|---------|
| HTML embebido en campos de texto | `subheading: "<div class='row'><h2>Affirmative</h2>..."` |
| Formatos de ejercicio inconsistentes | Flat (`answers[]` + `correct`) vs. nested (`questions[].answers[]`) |
| Sin tipado ni validación | Todo es JSON genérico sin contratos de tipo |
| Sin IDs estables | Los elementos se identifican solo por posición en array |
| Acoplamiento contenido/presentación | Clases Bootstrap (`col-4`, `font-weight-bold`) dentro del contenido |
| Sin soporte multi-examen | Estructura pensada solo para Aptis |
| Tokens inconsistentes | `{x}` = blank, `{v}` = line break, `answers: ["x"]` = respuesta abierta |

---

## 3. Archivos Generados

```
src/schemas/course/
├── index.ts              — Barrel export público
├── enums.ts              — 9 enums (ExamProductType, SkillType, BlockType, etc.)
├── content.ts            — Sistema RichText + 15 tipos de ContentNode
├── assets.ts             — AudioAsset, ImageAsset
├── exercises.ts          — 12 variantes de ejercicio (discriminated union)
├── blocks.ts             — 5 tipos de bloque (discriminated union)
├── hierarchy.ts          — ExamProduct → Course → Unit → Section
├── validation.ts         — Schemas Zod para validación runtime
├── MIGRATION.md          — Guía de migración legacy → nuevo schema
├── REPORT.md             — Este documento
└── samples/
    └── unit-1.ts         — Unit 1 migrada con contenido real
```

---

## 4. Arquitectura del Schema

### 4.1 Jerarquía de Contenido

```
ExamProduct          (Aptis, IELTS, Cambridge, TOEFL)
  └── Course         (programa completo con schemaVersion)
       └── Unit      (módulo temático: "Present Tenses & Daily Routines")
            └── Section   (agrupación por skill: Grammar, Speaking, Writing...)
                 └── Block     (unidad atómica de renderizado)
                      ├── TheoryBlock      → ContentNode[]
                      ├── ExerciseBlock    → Exercise + ExerciseInteraction
                      ├── MediaBlock       → ImageAsset[] / AudioAsset
                      ├── InstructionBlock → ContentNode[]
                      └── DividerBlock
```

### 4.2 Enums Definidos

| Enum | Valores | Propósito |
|------|---------|-----------|
| `ExamProductType` | aptis, ielts, cambridge_b2, cambridge_c1, toefl | Producto de certificación |
| `SkillType` | grammar, vocabulary, listening, speaking, reading, writing | Habilidad lingüística |
| `BlockType` | theory, exercise, media, instruction, divider | Tipo de bloque de renderizado |
| `ExerciseType` | 12 variantes (ver §4.3) | Modelo de interacción |
| `ReviewMode` | auto, human, hybrid | Modo de evaluación |
| `DifficultyLevel` | A1, A2, B1, B2, C1, C2 | Nivel CEFR |
| `ScoringMode` | binary, partial, rubric, unscored | Modelo de puntuación |
| `ContentNodeType` | 15 tipos (paragraph, heading, list, conjugation_table, etc.) | Nodos de contenido estructurado |
| `TextMark` | bold, italic, underline, strikethrough, highlight, color | Formato inline de texto |

### 4.3 Variantes de Ejercicio

| Tipo | Uso | Legacy equivalente |
|------|-----|--------------------|
| `multiple_choice` | Selección múltiple con una respuesta correcta | Grammar/Vocabulary/Reading con `questions[].answers` |
| `fill_in_the_blank` | Completar con texto escrito | Preguntas con `{x}` y `answers: ["x"]` |
| `gap_select` | Seleccionar de banco de palabras | Reading Part 3 con word list |
| `ordering` | Ordenar elementos | (nuevo, sin equivalente legacy) |
| `matching` | Emparejar columnas | (nuevo, sin equivalente legacy) |
| `speaking_open` | Respuesta oral grabada | Speaking Part 1 sin imágenes |
| `speaking_image` | Respuesta oral con prompt visual | Speaking Part 2 con `imageUrl.images` |
| `writing_open` | Respuesta escrita libre | Writing Part 2 con `subtitle` |
| `writing_form` | Campos cortos tipo formulario | Writing Part 1 "Fill the form" |
| `listening_select` | Escuchar y seleccionar respuesta | Listening con `recordingUrl` + `answers` flat |
| `true_false` | Verdadero/Falso | (nuevo, sin equivalente legacy) |
| `drag_drop` | Arrastrar y soltar | (nuevo, sin equivalente legacy) |

### 4.4 Sistema de Contenido Estructurado (reemplaza HTML)

El HTML embebido en `theory.subheading` se reemplaza por un árbol de `ContentNode[]`:

```
Legacy HTML:
  <div class='row'>
    <div class='col-4'><h2>Affirmative</h2></div>
    <div class='col-8'><em>I, you, we, they <strong>swim</strong></em></div>
  </div>

Nuevo schema:
  {
    type: "conjugation_table",
    label: "Affirmative",
    rows: [
      { subject: "I, you, we, they", form: "swim" },
      { subject: "He, she, it", form: "swims" }
    ]
  }
```

Nodos específicos para contenido educativo:
- **`ConjugationTableNode`** — Tablas de conjugación (reemplaza layouts Bootstrap)
- **`ExampleSentenceNode`** — Oraciones de ejemplo con formato (reemplaza `<em style="color:blue">`)
- **`CalloutNode`** — Cajas de tip/warning/note/example

### 4.5 Separación Contenido / Comportamiento

El metadata de interacción (`ExerciseInteraction`) vive en el `ExerciseBlock`, no dentro del ejercicio:

```typescript
interface ExerciseInteraction {
  xp: number;                    // XP otorgado
  difficulty?: DifficultyLevel;  // Nivel CEFR
  retryable: boolean;            // Reintentable
  shuffleOptions: boolean;       // Barajar opciones
  scoringMode: ScoringMode;      // binary | partial | rubric | unscored
  timeLimitSec?: number;         // Límite de tiempo
  examMode: boolean;             // UI estilo examen
}
```

---

## 5. Validación con Zod

Cada tipo TypeScript tiene un schema Zod correspondiente en `validation.ts`. Uso:

```typescript
import { CourseSchema } from "schemas/course/validation";

const result = CourseSchema.safeParse(jsonData);
if (!result.success) {
  console.error(result.error.issues);
}
```

Características:
- Discriminated unions con `z.discriminatedUnion("type", [...])`
- Tipos recursivos con `z.lazy()` para `ContentNode` (blockquote/callout contienen nodos hijos)
- Validación de enums con `z.enum([...])`
- Campos opcionales explícitos con `.optional()`

---

## 6. Tabla de Conversión de Tokens Legacy

| Token Legacy | Nuevo equivalente | Contexto |
|-------------|-------------------|----------|
| `{x}` | `___` | Placeholder de blank en prompts |
| `{x}` | *(se elimina)* | En prompts de speaking |
| `{v}` | `\n` | Salto de línea en descripciones |
| `answers: ["x"]` | Sin `correctOptionId` | Indica respuesta abierta |
| `correct: N` | `correctOptionId: options[N].id` | Índice 0-based → referencia por ID |
| `point: true` | `awardsProgress: true` + `xp: N` | Tracking de progreso |
| `exam: true` | `examMode: true` | UI estilo examen |
| `"A. text"` | `"text"` | Se eliminan prefijos de letras |
| `" 1. text"` | `"text"` | Se eliminan prefijos numéricos |

---

## 7. Sample: Unit 1 Migrada

El archivo `samples/unit-1.ts` contiene una migración real del Unit 1 de `aptis-course.json` con tres secciones:

1. **Grammar** — 2 bloques de teoría (Present Simple con conjugation tables + uses) y 1 bloque de ejercicio multiple choice
2. **Speaking** — 1 bloque de teoría (Daily Routines vocab) + 1 ejercicio speaking_image (Part 2 con imágenes y audio) + 1 ejercicio speaking_open (Part 1 sin imágenes)
3. **Writing** — 1 ejercicio writing_form (Part 1, formulario) + 1 ejercicio writing_open (Part 2, texto libre)

---

## 8. Estrategia de Migración Incremental

| Fase | Acción |
|------|--------|
| **1** | Crear script de migración; generar JSON nuevos junto a los legacy |
| **2** | Construir renderers nuevos que consuman el nuevo schema |
| **3** | Feature flag para alternar entre renderers legacy y nuevos |
| **4** | Validar que los 15 units renderizan idénticamente con ambos schemas |
| **5** | Eliminar renderers y archivos JSON legacy |

---

## 9. Decisiones de Diseño

| Decisión | Justificación |
|----------|---------------|
| TypeScript enums en lugar de string literals | Autocompletado en IDE, refactor seguro, single source of truth |
| Discriminated unions para Block y Exercise | Type narrowing nativo de TS, exhaustive switch checking |
| `ContentNode` recursivo | Soporta nesting (blockquote con párrafos internos, callouts con listas) |
| `ConjugationTableNode` como nodo propio | Patrón extremadamente frecuente en contenido de gramática; evita recrear layouts Bootstrap |
| IDs estables en toda la jerarquía | Habilita tracking de progreso, deep linking, analytics por pregunta |
| `schemaVersion` en Course | Permite migraciones automáticas futuras sin romper contenido existente |
| Zod schemas paralelos a los tipos TS | Validación runtime en boundaries (API, file loading) sin duplicar definiciones |
| `ExerciseInteraction` separado del contenido | El mismo ejercicio puede tener XP, retries y scoring diferentes según contexto |

---

## 10. Dependencias Requeridas

La única dependencia nueva necesaria es **Zod** para validación runtime:

```bash
npm install zod --legacy-peer-deps
```

> Nota: Se usa `--legacy-peer-deps` por la restricción de React 17 del proyecto.

Los archivos TypeScript `.ts` pueden coexistir en el proyecto JavaScript actual — solo requieren que el bundler (Vite) los procese, lo cual ya soporta de forma nativa.
