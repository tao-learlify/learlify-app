/**
 * adaptLegacyCourse — CDN payload → Unit v2 adapter
 *
 * This is the schema boundary between the legacy Learlify CDN
 * format (aptis-course.json) and the schema v2 runtime.
 *
 * CONTRACT:
 *   Input  → raw JSON object as returned by api.courses.fetchCourse()
 *   Output → Unit (schema v2, as defined in schemas/course/hierarchy.ts)
 *
 * The runtime (UnitView / BlockRenderer / ExerciseRouter) NEVER
 * receives raw CDN data. All adaptation happens here before the
 * data reaches any React component.
 *
 * LEGACY FORMAT NOTES:
 *   - Sections live at rawCourse.sections[] (0-indexed)
 *   - Each section: { type, as, content: [...] }
 *   - Each content item is either { theory } or { exercise }
 *   - answers can be string[] OR { title: string }[]
 *   - Listening exercises have NO questions[] — the exercise IS the question
 *   - Speaking exercises are open-ended (answers: ["x"], correct: 0)
 *   - {x} = blank placeholder, {v} = visual line break
 *
 * @module adaptLegacyCourse
 */

import { htmlToContentNodes } from './htmlToContentNodes'

// ── Constants ─────────────────────────────────────────────────

/** XP awarded per scored exercise question. */
const XP_PER_QUESTION = 10

/** XP awarded for unscored (speaking/writing) exercise blocks. */
const XP_UNSCORED = 10

// ── Pure helpers ──────────────────────────────────────────────

/**
 * Maps the legacy section type/as fields to a schema v2 SkillType.
 *
 * @param {string} type  - Section "type" field (e.g. "Grammar & Vocabulary")
 * @param {string} as    - Section "as" field (e.g. "Grammar")
 * @returns {import('schemas/course/enums').SkillType}
 */
function toSkill(type, as) {
  if (type === 'Grammar & Vocabulary') {
    return as === 'Vocabulary' ? 'vocabulary' : 'grammar'
  }
  const normalized = (type || '').toLowerCase()
  if (normalized.includes('listen')) return 'listening'
  if (normalized.includes('speak')) return 'speaking'
  if (normalized.includes('read')) return 'reading'
  if (normalized.includes('writ')) return 'writing'
  return 'grammar'
}

/**
 * Extracts the text from a legacy answer entry.
 * Handles both object format { title: "A. text" } and plain string "A. text".
 * Strips leading letter prefix (A., B., ...) and digit prefix (1., 2., ...).
 *
 * @param {string | { title: string }} answer
 * @returns {string}
 */
function getAnswerText(answer) {
  const raw = typeof answer === 'string' ? answer : (answer && answer.title) || ''
  return raw
    .replace(/^[A-Ha-h]\.\s*/, '')
    .replace(/^\d+\.\s*/, '')
    .trim()
}

/**
 * Cleans a legacy prompt string:
 *   {x} → ___ (visible blank marker)
 *   {v} → space (visual line break token)
 *   Leading digit prefix → removed
 *
 * @param {string} str
 * @returns {string}
 */
function cleanPrompt(str) {
  return (str || '')
    .replace(/\{x\}/g, '___')
    .replace(/\{v\}\s*/g, ' ')
    .replace(/^\s*\d+\.\s*/, '')
    .trim()
}

/**
 * Infers the ExerciseType from skill and exercise content.
 *
 * Rules:
 *   listening            → listening_select
 *   speaking (has image/audio per-question) → speaking_image
 *   speaking             → speaking_open
 *   writing (multi-question form) → writing_form
 *   writing              → writing_open
 *   reading/grammar/vocab with {x} in prompt → gap_select
 *   reading with True/False answers          → true_false
 *   else                 → multiple_choice
 *
 * @param {string} skill
 * @param {Object} exercise - Raw legacy exercise object
 * @returns {import('schemas/course/enums').ExerciseType}
 */
function inferExerciseType(skill, exercise) {
  if (skill === 'listening') return 'listening_select'

  if (skill === 'speaking') {
    const questions = exercise.questions || []
    const hasAudioOrImage = questions.some(
      q => q.recordingUrl || (q.imageUrl && q.imageUrl.images && q.imageUrl.images.length > 0)
    )
    return hasAudioOrImage ? 'speaking_image' : 'speaking_open'
  }

  if (skill === 'writing') {
    // Writing Part 1 is a form (multiple short-answer fields).
    // Heuristic: multiple questions with field-label prompts → writing_form
    const questions = exercise.questions || []
    if (questions.length > 1) return 'writing_form'
    return 'writing_open'
  }

  // reading, grammar, vocabulary
  const allQuestions = exercise.questions || []
  const firstPrompt = allQuestions[0]
    ? (allQuestions[0].title || allQuestions[0].prompt || '')
    : (exercise.description || '')

  if (firstPrompt.includes('{x}')) return 'gap_select'

  const firstAnswers = allQuestions[0]
    ? (allQuestions[0].answers || [])
    : []

  if (firstAnswers.length === 2) {
    const texts = firstAnswers.map(a => getAnswerText(a).toLowerCase())
    if (texts.includes('true') && texts.includes('false')) return 'true_false'
  }

  return 'multiple_choice'
}

/**
 * Returns true when the exercise should be scored automatically.
 * Speaking and writing exercises are unscored at the exercise level.
 *
 * @param {string} exerciseType
 * @returns {boolean}
 */
function isAutoScored(exerciseType) {
  return !['speaking_open', 'speaking_image', 'writing_open', 'writing_form'].includes(exerciseType)
}

// ── Block-level builders ──────────────────────────────────────

/**
 * Builds a schema v2 TheoryBlock or MediaBlock from a legacy
 * theory content item.
 *
 * Variant A (HTML body):  { theory: { heading, subheading: "<html>" } }
 *   → TheoryBlock with body from htmlToContentNodes
 *
 * Variant B (image only): { theory: { imageUrl: { images: [...] } } }
 *   → TheoryBlock with image asset (no body)
 *
 * @param {Object} theory - Legacy theory object
 * @param {string} blockId
 * @returns {import('schemas/course/blocks').TheoryBlock}
 */
function buildTheoryBlock(theory, blockId) {
  const imageUrl = theory.imageUrl
  const hasImages = imageUrl && Array.isArray(imageUrl.images) && imageUrl.images.length > 0

  /** @type {import('schemas/course/blocks').TheoryBlock} */
  const block = {
    type: 'theory',
    id: blockId,
    heading: theory.heading || undefined,
    title: theory.title || undefined,
    body: []
  }

  if (theory.subheading) {
    block.body = htmlToContentNodes(theory.subheading)
  } else {
    block.body = [{ type: 'paragraph', children: [{ text: '' }] }]
  }

  if (hasImages) {
    block.image = { src: imageUrl.images[0], alt: theory.heading || '' }
  }

  return block
}

/**
 * Adapts a LISTENING exercise (flat, no questions array) to schema v2.
 *
 * The legacy listening exercise is the question itself — there is
 * no nested questions[]. We synthesize a single-question array.
 *
 * @param {Object} exercise - Raw legacy exercise
 * @param {number} blockIndex - Global block index (for ID generation)
 * @param {string} blockId
 * @returns {import('schemas/course/exercises').ListeningSelectExercise}
 */
function buildListeningExercise(exercise, blockIndex, blockId) {
  const answers = exercise.answers || []
  const correct = exercise.correct || 0

  const options = answers.map((a, m) => ({
    id: `opt-${blockIndex}-0-${m}`,
    text: getAnswerText(a)
  }))

  const correctOption = options[correct]

  const question = {
    id: `q-${blockIndex}-0`,
    prompt: cleanPrompt(exercise.description || ''),
    options,
    correctOptionId: correctOption ? correctOption.id : (options[0] ? options[0].id : '')
  }

  return {
    id: blockId,
    type: 'listening_select',
    label: exercise.label || 'Listening',
    description: '',
    audio: { src: exercise.recordingUrl || '', alt: 'Audio' },
    questions: [question]
  }
}

/**
 * Adapts a SPEAKING exercise to schema v2.
 * Handles both speaking_image and speaking_open variants.
 *
 * @param {Object} exercise - Raw legacy exercise
 * @param {string} type - 'speaking_image' | 'speaking_open'
 * @param {number} blockIndex
 * @param {string} blockId
 * @returns {import('schemas/course/exercises').SpeakingOpenExercise | import('schemas/course/exercises').SpeakingImageExercise}
 */
function buildSpeakingExercise(exercise, type, blockIndex, blockId) {
  const questions = (exercise.questions || []).map((q, n) => {
    /** @type {import('schemas/course/exercises').ExerciseQuestion} */
    const question = {
      id: `q-${blockIndex}-${n}`,
      prompt: cleanPrompt(q.title || '')
    }

    if (q.recordingUrl) {
      question.audio = { src: q.recordingUrl, alt: 'Prompt audio' }
    }

    if (q.imageUrl && Array.isArray(q.imageUrl.images) && q.imageUrl.images.length > 0) {
      question.image = { src: q.imageUrl.images[0], alt: question.prompt }
    }

    return question
  })

  return {
    id: blockId,
    type,
    label: exercise.label || 'Speaking',
    description: cleanPrompt(exercise.description || ''),
    recordingTimeSec: exercise.recordingTime || 30,
    questions
  }
}

/**
 * Adapts a WRITING exercise to schema v2.
 * writing_form → multiple short-answer fields
 * writing_open → single free-text area
 *
 * @param {Object} exercise
 * @param {string} type - 'writing_form' | 'writing_open'
 * @param {number} blockIndex
 * @param {string} blockId
 * @returns {import('schemas/course/exercises').WritingFormExercise | import('schemas/course/exercises').WritingOpenExercise}
 */
function buildWritingExercise(exercise, type, blockIndex, blockId) {
  const questions = (exercise.questions || []).map((q, n) => ({
    id: `q-${blockIndex}-${n}`,
    prompt: cleanPrompt(q.title || q.subtitle || '')
  }))

  const adapted = {
    id: blockId,
    type,
    label: exercise.label || 'Writing',
    description: cleanPrompt(exercise.description || ''),
    questions
  }

  // Extract word range hint from description (e.g. "(20-30 words)")
  const wordRangeMatch = (exercise.description || '').match(/\((\d+)[–\-](\d+)\s*words?\)/i)
  if (wordRangeMatch) {
    adapted.wordRange = {
      min: parseInt(wordRangeMatch[1], 10),
      max: parseInt(wordRangeMatch[2], 10)
    }
  }

  return adapted
}

/**
 * Adapts a SELECTION / INPUT exercise (grammar, vocabulary, reading)
 * to schema v2. Handles gap_select, multiple_choice, and true_false.
 *
 * @param {Object} exercise
 * @param {string} type - ExerciseType
 * @param {number} blockIndex
 * @param {string} blockId
 * @returns {import('schemas/course/exercises').ExerciseBase}
 */
function buildSelectionExercise(exercise, type, blockIndex, blockId) {
  const questions = (exercise.questions || []).map((q, n) => {
    const answers = q.answers || []
    const correct = typeof q.correct === 'number' ? q.correct : 0

    const options = answers.map((a, m) => ({
      id: `opt-${blockIndex}-${n}-${m}`,
      text: getAnswerText(a)
    }))

    const correctOption = options[correct]

    return {
      id: `q-${blockIndex}-${n}`,
      prompt: cleanPrompt(q.title || q.prompt || ''),
      options,
      correctOptionId: correctOption ? correctOption.id : (options[0] ? options[0].id : '')
    }
  })

  return {
    id: blockId,
    type,
    label: exercise.label || '',
    description: cleanPrompt(exercise.description || ''),
    questions
  }
}

/**
 * Builds an ExerciseBlock from a legacy exercise content item.
 *
 * Routes to the correct exercise builder based on inferred type,
 * then wraps the result in an ExerciseBlock with interaction rules.
 *
 * @param {Object} exercise - Raw legacy exercise object
 * @param {string} skill    - Schema v2 SkillType
 * @param {number} blockIndex - Global block index (for IDs + XP)
 * @param {string} blockId
 * @returns {import('schemas/course/blocks').ExerciseBlock}
 */
function buildExerciseBlock(exercise, skill, blockIndex, blockId) {
  const exerciseType = inferExerciseType(skill, exercise)
  const scored = isAutoScored(exerciseType)

  let adapted
  switch (exerciseType) {
    case 'listening_select':
      adapted = buildListeningExercise(exercise, blockIndex, blockId)
      break
    case 'speaking_open':
    case 'speaking_image':
      adapted = buildSpeakingExercise(exercise, exerciseType, blockIndex, blockId)
      break
    case 'writing_open':
    case 'writing_form':
      adapted = buildWritingExercise(exercise, exerciseType, blockIndex, blockId)
      break
    default:
      adapted = buildSelectionExercise(exercise, exerciseType, blockIndex, blockId)
  }

  const questionCount = adapted.questions ? adapted.questions.length : 1
  const xp = scored ? questionCount * XP_PER_QUESTION : XP_UNSCORED

  /** @type {import('schemas/course/blocks').ExerciseBlock} */
  return {
    type: 'exercise',
    id: blockId,
    exercise: adapted,
    interaction: {
      xp,
      retryable: true,
      shuffleOptions: false,
      scoringMode: scored ? 'binary' : 'unscored',
      examMode: false
    }
  }
}

// ── Section builder ───────────────────────────────────────────

/**
 * Builds a schema v2 Section from a legacy section object.
 *
 * @param {Object} section       - Raw legacy section ({ type, as, content })
 * @param {number} unitIndex     - 0-based unit index
 * @param {number} sectionIndex  - 0-based section index within unit
 * @param {{ value: number }} blockCounter - Mutable counter shared across sections
 * @returns {import('schemas/course/hierarchy').Section}
 */
function buildSection(section, unitIndex, sectionIndex, blockCounter) {
  const i = unitIndex
  const j = sectionIndex
  const sectionId = `unit-${i}-section-${j}`
  const skill = toSkill(section.type, section.as)

  /** @type {import('schemas/course/blocks').Block[]} */
  const blocks = []

  for (const item of section.content || []) {
    const k = blockCounter.value++
    const blockId = `unit-${i}-block-${k}`

    if (item.theory) {
      blocks.push(buildTheoryBlock(item.theory, blockId))
    } else if (item.exercise) {
      blocks.push(buildExerciseBlock(item.exercise, skill, k, blockId))
    }
    // Items with neither theory nor exercise are silently skipped
  }

  return {
    id: sectionId,
    skill,
    title: `${section.as || section.type}`,
    blocks,
    awardsProgress: true
  }
}

// ── Public API ────────────────────────────────────────────────

/**
 * Adapts a full legacy CDN course payload into a single schema v2 Unit.
 *
 * This is the primary entry point for the adapter layer. Call this
 * once per unit after fetching the CDN JSON. The result is passed
 * directly to UnitView — no further transformation needed.
 *
 * @param {Object} rawCourse  - Parsed JSON from api.courses.fetchCourse()
 * @param {number} unitIndex  - 0-based index of the unit to extract
 * @returns {import('schemas/course/hierarchy').Unit}
 *
 * @example
 *   const raw = await api.courses.fetchCourse(course.views.url)
 *   const unit = adaptLegacyCourse(raw, 0)
 *   // unit is now a valid Unit v2 object ready for UnitView
 */
export function adaptLegacyCourse(rawCourse, unitIndex = 0) {
  if (!rawCourse || typeof rawCourse !== 'object') {
    throw new TypeError('adaptLegacyCourse: rawCourse must be a non-null object')
  }

  // The CDN payload is an array of units at the top level OR
  // it may be an object with a "units" key — normalise both shapes.
  let units = rawCourse
  if (!Array.isArray(rawCourse)) {
    units = rawCourse.units || rawCourse.sections
      ? [rawCourse]  // single-unit payload
      : []
  }

  const rawUnit = Array.isArray(units) ? units[unitIndex] : rawCourse

  if (!rawUnit || !rawUnit.sections) {
    throw new Error(
      `adaptLegacyCourse: no unit found at index ${unitIndex} in the CDN payload`
    )
  }

  const unitId = `unit-${unitIndex + 1}`
  const blockCounter = { value: 0 }

  const sections = (rawUnit.sections || []).map((section, j) =>
    buildSection(section, unitIndex, j, blockCounter)
  )

  // Derive a display title from section names if not explicitly set
  const unitTitle = rawUnit.title || rawUnit.name || `Unit ${unitIndex + 1}`

  /** @type {import('schemas/course/hierarchy').Unit} */
  return {
    id: unitId,
    order: unitIndex + 1,
    title: unitTitle,
    subtitle: rawUnit.subtitle || undefined,
    description: rawUnit.description || undefined,
    sections
  }
}
