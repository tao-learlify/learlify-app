// =============================================================================
// Unit 1 — Daily Routines: Full Migration to Schema v2
// =============================================================================
//
// Source: aptis-course.json → views[0]
// Schema: src/schemas/course/* (v2)
//
// MIGRATION NOTES
// ───────────────
// MN-001  All 6 grammar exercises carry the legacy label "Reading Part 3".
//         This is a mislabelling — they are grammar gap-select exercises testing
//         Present Simple vs. Present Continuous. Relabelled "Grammar Exercise N".
//
// MN-002  Grammar exercises form a continuous narrative about Marc and Paul
//         shopping for trainers. Sentence fragments spanning two questions are
//         preserved verbatim; legacy {x} → ___ in prompt text.
//
// MN-003  Legacy {v} signals a paragraph break. In v2 this is expressed by
//         separate ContentNodes or separate prompt strings. Inline {v}
//         occurrences are stripped from plain-text prompts.
//
// MN-004  Vocabulary exercise 1 contains two disjoint word banks (Q1–5 and
//         Q6–10). GapSelectExercise.wordBank lists all 16 words for reference.
//         Renderers must use question.options (not exercise.wordBank) for UI.
//
// MN-005  Speaking exercises 2–4 have recordingUrl: null in the legacy source.
//         Treated as speaking_open (text-only prompts, no audio cue).
//
// MN-006  Speaking exercise 1 ("Speaking Part 2") has per-question audio prompts
//         and images. Typed as speaking_image. Image URL is shared (UNIT-1-2.jpg).
//
// MN-007  Reading section interleaves theory and exercise blocks:
//         theory-morning → exercise-t/f → theory-afternoon → exercise-mc.
//         Block order in the array mirrors this original sequence.
//
// MN-008  Legacy point: true marks contribution to course progress. Mapped to
//         awardsProgress: true at the Section level. All Unit 1 sections award
//         progress (every section has at least one point: true item).
//
// MN-009  HTML theory content (subheading field) is converted to ContentNode
//         arrays. Visual formatting (Bootstrap grid, colour styles) is dropped.
//         Semantic structure (headings, conjugation tables, lists, examples)
//         is preserved faithfully to the source educational content.
//
// MN-010  WritingForm fields: legacy title strings (e.g. "Name: {x}") are
//         cleaned to plain labels. {x} placeholder and trailing colons removed.
// =============================================================================

import type { Unit } from "../hierarchy";

export const unit1 = {
  id: "unit-1",
  order: 1,
  title: "Unit 1 — Daily Routines",
  subtitle: "Talking about habits, routines, and leisure time",
  learningObjective:
    "By the end of this unit you will be able to describe daily and weekend " +
    "routines using Present Simple and Present Continuous, and discuss hobbies, " +
    "lifestyle vocabulary, and personal preferences.",
  estimatedDurationMin: 90,
  difficulty: "A2",
  theme: {
    name: "Daily Routines",
    accent: "#3B82F6",
    accentSoft: "#DBEAFE",
    surface: "#F0F9FF",
    icon: "calendar",
    mood: "energetic",
  },
  sections: [

    // =========================================================================
    // SECTION 1 — Grammar
    // Present Simple & Present Continuous
    // =========================================================================
    {
      id: "u1-s-grammar",
      skill: "grammar",
      title: "Grammar — Present Simple & Present Continuous",
      awardsProgress: true,
      blocks: [

        // ── Theory 1: Present Simple (conjugation + rules) ────────────────────
        {
          type: "theory" as const,
          id: "u1-gr-theory-1",
          heading: "Present Simple",
          body: [
            {
              type: "conjugation_table" as const,
              label: "Affirmative",
              rows: [
                { subject: "I, you, we, they", form: "swim" },
                { subject: "He, she, it",      form: "swims" },
              ],
            },
            {
              type: "paragraph" as const,
              children: [
                { text: "With most verbs, we add " },
                { text: "-s", marks: [{ type: "bold" as const }] },
                { text: " to the third person singular (affirmative only)." },
              ],
            },
            {
              type: "paragraph" as const,
              children: [
                { text: "When verbs end in " },
                { text: "o, s, sh, ch or x", marks: [{ type: "bold" as const }] },
                { text: " we add " },
                { text: "-es", marks: [{ type: "bold" as const }] },
                { text: " instead: " },
                { text: "I watch TV → She watches TV.", marks: [{ type: "italic" as const }] },
              ],
            },
            {
              type: "paragraph" as const,
              children: [
                { text: "Verbs ending in consonant +" },
                { text: " -y", marks: [{ type: "bold" as const }] },
                { text: " replace -y with " },
                { text: "-ies", marks: [{ type: "bold" as const }] },
                { text: ": " },
                { text: "I try → She tries.", marks: [{ type: "italic" as const }] },
              ],
            },
            {
              type: "conjugation_table" as const,
              label: "Negative",
              rows: [
                { subject: "I, you, we, they", form: "don't swim / do not swim" },
                { subject: "He, she, it",      form: "doesn't swim / does not swim" },
              ],
            },
            {
              type: "conjugation_table" as const,
              label: "Interrogative",
              rows: [
                { subject: "Do",   form: "I, you, we, they swim?" },
                { subject: "Does", form: "he, she, it swim?" },
              ],
            },
            {
              type: "conjugation_table" as const,
              label: "Short answers",
              rows: [
                { subject: "Yes, I do.",    form: "No, you don't." },
                { subject: "Yes, he does.", form: "No, she doesn't." },
              ],
            },
          ],
        },

        // ── Theory 2: Uses of Present Simple ─────────────────────────────────
        {
          type: "theory" as const,
          id: "u1-gr-theory-2",
          body: [
            {
              type: "paragraph" as const,
              children: [{ text: "We use the Present Simple to talk about:" }],
            },
            {
              type: "list" as const,
              ordered: true,
              items: [
                {
                  type: "list_item" as const,
                  children: [
                    { text: "Daily routines or habits: " },
                    { text: "Every day I get up at 7.30.", marks: [{ type: "italic" as const }] },
                  ],
                },
                {
                  type: "list_item" as const,
                  children: [
                    { text: "Timetables: " },
                    { text: "The shops in this country open at 5 o'clock.", marks: [{ type: "italic" as const }] },
                  ],
                },
                {
                  type: "list_item" as const,
                  children: [
                    { text: "General truths: " },
                    { text: "The Sun sets in the East.", marks: [{ type: "italic" as const }] },
                  ],
                },
                {
                  type: "list_item" as const,
                  children: [
                    { text: "Stative verbs: " },
                    { text: "I know the truth now.", marks: [{ type: "italic" as const }] },
                  ],
                },
                {
                  type: "list_item" as const,
                  children: [
                    { text: "Future reference: " },
                    { text: "When I see you tomorrow, I'll tell you the truth.", marks: [{ type: "italic" as const }] },
                  ],
                },
              ],
            },
            {
              type: "paragraph" as const,
              children: [
                {
                  text: "Stative verbs include most verbs of emotion, existence, senses, " +
                    "likes/dislikes, belief and possession: ",
                },
                {
                  text: "see, taste, hear, hate, like, prefer, fancy, want, love, wish, " +
                    "believe, know, understand, realise, appear, seem, look like, own, " +
                    "belong, have (possession), smell.",
                  marks: [{ type: "italic" as const }],
                },
              ],
            },
            {
              type: "paragraph" as const,
              children: [
                { text: "Common frequency expressions: " },
                {
                  text: "always, usually, often, sometimes, hardly ever, seldom, never — " +
                    "every day/week/month/year — in the morning/afternoon/evening — " +
                    "once, twice, three times a week.",
                  marks: [{ type: "italic" as const }],
                },
              ],
            },
            { type: "example_sentence" as const, sentence: [{ text: "I'm always late for school." }] },
            { type: "example_sentence" as const, sentence: [{ text: "I catch the train every day." }] },
            { type: "example_sentence" as const, sentence: [{ text: "I usually drink a cup of coffee in the morning." }] },
            { type: "example_sentence" as const, sentence: [{ text: "I go to the gym three times a week but John never goes." }] },
          ],
        },

        // ── Theory 3: Present Continuous ─────────────────────────────────────
        {
          type: "theory" as const,
          id: "u1-gr-theory-3",
          heading: "Present Continuous",
          body: [
            {
              type: "paragraph" as const,
              children: [
                { text: "We form the Present Continuous using the present tense of " },
                { text: "be", marks: [{ type: "bold" as const }] },
                { text: " and the " },
                { text: "-ing", marks: [{ type: "bold" as const }] },
                { text: " form of the main verb." },
              ],
            },
            {
              type: "conjugation_table" as const,
              label: "Affirmative",
              rows: [
                { subject: "I",             form: "am swimming" },
                { subject: "You, we, they", form: "are swimming" },
                { subject: "He, she, it",   form: "is swimming" },
              ],
            },
            {
              type: "heading" as const,
              level: 3,
              children: [{ text: "Negative Form" }],
            },
            {
              type: "paragraph" as const,
              children: [
                { text: "We add " },
                { text: "not", marks: [{ type: "bold" as const }] },
                { text: " after " },
                { text: "be", marks: [{ type: "bold" as const }] },
                { text: " and before the -ing verb. Contractions: " },
                { text: "I'm not / aren't / isn't.", marks: [{ type: "bold" as const }] },
              ],
            },
            {
              type: "conjugation_table" as const,
              label: "Negative",
              rows: [
                { subject: "I",             form: "am not swimming / I'm not swimming" },
                { subject: "You, we, they", form: "are not swimming / aren't swimming" },
                { subject: "He, she, it",   form: "is not swimming / isn't swimming" },
              ],
            },
            {
              type: "heading" as const,
              level: 3,
              children: [{ text: "Interrogative" }],
            },
            {
              type: "paragraph" as const,
              children: [
                { text: "To form the interrogative, put " },
                { text: "be", marks: [{ type: "bold" as const }] },
                { text: " before the subject:" },
              ],
            },
            {
              type: "conjugation_table" as const,
              label: "Interrogative",
              rows: [
                { subject: "Am I",              form: "swimming?" },
                { subject: "Are you, we, they", form: "swimming?" },
                { subject: "Is he, she, it",    form: "swimming?" },
              ],
            },
            {
              type: "conjugation_table" as const,
              label: "Short answers",
              rows: [
                { subject: "Yes, I am.",     form: "No, I am not." },
                { subject: "Yes, he is.",    form: "No, he isn't." },
                { subject: "Yes, they are.", form: "No, they aren't." },
              ],
            },
          ],
        },

        // ── Theory 4: Spelling Rules + Use (Present Continuous) ──────────────
        {
          type: "theory" as const,
          id: "u1-gr-theory-4",
          title: "Spelling Rules",
          body: [
            {
              type: "list" as const,
              ordered: true,
              items: [
                {
                  type: "list_item" as const,
                  children: [
                    { text: "Verbs ending in " },
                    { text: "-e", marks: [{ type: "bold" as const }] },
                    { text: " drop the -e when adding -ing: " },
                    { text: "Write → Writing.", marks: [{ type: "bold" as const }] },
                  ],
                },
                {
                  type: "list_item" as const,
                  children: [
                    { text: "Verbs ending in " },
                    { text: "-l", marks: [{ type: "bold" as const }] },
                    { text: " double the l when adding -ing: " },
                    { text: "Travel → Travelling.", marks: [{ type: "bold" as const }] },
                  ],
                },
                {
                  type: "list_item" as const,
                  children: [
                    { text: "Consonant + vowel + consonant verbs double the final consonant: " },
                    { text: "Sit → Sitting, Trip → Tripping, Run → Running, Stop → Stopping.", marks: [{ type: "bold" as const }] },
                  ],
                },
              ],
            },
            {
              type: "heading" as const,
              level: 2,
              children: [{ text: "Use — when to use the Present Continuous" }],
            },
            {
              type: "list" as const,
              ordered: true,
              items: [
                {
                  type: "list_item" as const,
                  children: [
                    { text: "Actions happening right now: " },
                    { text: "Right now, I am writing. / I am studying English.", marks: [{ type: "italic" as const }] },
                  ],
                },
                {
                  type: "list_item" as const,
                  children: [
                    { text: "Future arrangements (fixed plans with a time reference): " },
                    { text: "I am meeting her tonight. / I am going to France next week.", marks: [{ type: "italic" as const }] },
                  ],
                },
                {
                  type: "list_item" as const,
                  children: [
                    { text: "Temporary situations: " },
                    { text: "Marc is at university. He is studying maths. / John is unemployed. He is looking for a job.", marks: [{ type: "italic" as const }] },
                  ],
                },
              ],
            },
          ],
        },

        // ── Exercise 1/6: Grammar Gap-Select (Marc & Paul, Part 1) ───────────
        {
          type: "exercise" as const,
          id: "u1-gr-block-ex-1",
          exercise: {
            id: "u1-gr-ex-1",
            type: "gap_select" as const,
            label: "Grammar Exercise 1",
            description:
              "Read the text and complete each gap with the correct verb form. " +
              "(Marc and Paul are looking at trainers in a shop.)",
            questions: [
              {
                id: "u1-gr-ex-1-q1",
                prompt: "Marc and Paul (1) ___ at some brand-name trainers.",
                options: [
                  { id: "u1-gr-ex-1-q1-a", text: "are looking" },
                  { id: "u1-gr-ex-1-q1-b", text: "look" },
                  { id: "u1-gr-ex-1-q1-c", text: "is looking" },
                ],
                correctOptionId: "u1-gr-ex-1-q1-a",
              },
              {
                id: "u1-gr-ex-1-q2",
                prompt: "These days, fashionable shoes like these (2) ___ a lot of money.",
                options: [
                  { id: "u1-gr-ex-1-q2-a", text: "cost" },
                  { id: "u1-gr-ex-1-q2-b", text: "are costing" },
                  { id: "u1-gr-ex-1-q2-c", text: "costs" },
                ],
                correctOptionId: "u1-gr-ex-1-q2-a",
              },
              {
                id: "u1-gr-ex-1-q3",
                prompt: "But Marc and Paul (3) ___ their wages every summer and can afford them.",
                options: [
                  { id: "u1-gr-ex-1-q3-a", text: "is saving" },
                  { id: "u1-gr-ex-1-q3-b", text: "save" },
                  { id: "u1-gr-ex-1-q3-c", text: "saves" },
                ],
                correctOptionId: "u1-gr-ex-1-q3-b",
              },
            ],
          },
          interaction: {
            xp: 10, retryable: true, shuffleOptions: false,
            scoringMode: "binary" as const, examMode: false,
          },
        },

        // ── Exercise 2/6: Grammar Gap-Select (Marc & Paul, Part 2) ───────────
        {
          type: "exercise" as const,
          id: "u1-gr-block-ex-2",
          exercise: {
            id: "u1-gr-ex-2",
            type: "gap_select" as const,
            label: "Grammar Exercise 2",
            description: "Continue reading. Complete each gap with the correct verb form.",
            questions: [
              {
                id: "u1-gr-ex-2-q1",
                prompt: "Paul ___ very old trainers, so he",
                options: [
                  { id: "u1-gr-ex-2-q1-a", text: "have" },
                  { id: "u1-gr-ex-2-q1-b", text: "having" },
                  { id: "u1-gr-ex-2-q1-c", text: "has" },
                ],
                correctOptionId: "u1-gr-ex-2-q1-c",
              },
              {
                id: "u1-gr-ex-2-q2",
                prompt: "___ to buy a new pair.",
                options: [
                  { id: "u1-gr-ex-2-q2-a", text: "is wanting" },
                  { id: "u1-gr-ex-2-q2-b", text: "wants" },
                  { id: "u1-gr-ex-2-q2-c", text: "is want" },
                ],
                correctOptionId: "u1-gr-ex-2-q2-b",
              },
            ],
          },
          interaction: {
            xp: 10, retryable: true, shuffleOptions: false,
            scoringMode: "binary" as const, examMode: false,
          },
        },

        // ── Exercise 3/6: Grammar Gap-Select (Marc & Paul, Part 3) ───────────
        {
          type: "exercise" as const,
          id: "u1-gr-block-ex-3",
          exercise: {
            id: "u1-gr-ex-3",
            type: "gap_select" as const,
            label: "Grammar Exercise 3",
            description: "Continue reading. Complete each gap with the correct verb form.",
            questions: [
              {
                id: "u1-gr-ex-3-q1",
                prompt: "Right now, he ___ a pair of Nike trainers.",
                options: [
                  { id: "u1-gr-ex-3-q1-a", text: "is trying on" },
                  { id: "u1-gr-ex-3-q1-b", text: "try on" },
                  { id: "u1-gr-ex-3-q1-c", text: "trying on" },
                ],
                correctOptionId: "u1-gr-ex-3-q1-a",
              },
              {
                id: "u1-gr-ex-3-q2",
                prompt: "They ___ very trendy, but at least they",
                options: [
                  { id: "u1-gr-ex-3-q2-a", text: "doesn't look" },
                  { id: "u1-gr-ex-3-q2-b", text: "don't look" },
                  { id: "u1-gr-ex-3-q2-c", text: "look" },
                ],
                correctOptionId: "u1-gr-ex-3-q2-b",
              },
              {
                id: "u1-gr-ex-3-q3",
                prompt: "___ reasonably priced.",
                options: [
                  { id: "u1-gr-ex-3-q3-a", text: "is" },
                  { id: "u1-gr-ex-3-q3-b", text: "are" },
                  { id: "u1-gr-ex-3-q3-c", text: "was" },
                ],
                correctOptionId: "u1-gr-ex-3-q3-b",
              },
            ],
          },
          interaction: {
            xp: 10, retryable: true, shuffleOptions: false,
            scoringMode: "binary" as const, examMode: false,
          },
        },

        // ── Exercise 4/6: Grammar Gap-Select (Marc & Paul, Part 4) ───────────
        {
          type: "exercise" as const,
          id: "u1-gr-block-ex-4",
          exercise: {
            id: "u1-gr-ex-4",
            type: "gap_select" as const,
            label: "Grammar Exercise 4",
            description: "Continue reading. Complete each gap with the correct verb form.",
            questions: [
              {
                id: "u1-gr-ex-4-q1",
                prompt: "Marc says, 'These trainers ___ very well,",
                options: [
                  { id: "u1-gr-ex-4-q1-a", text: "don't fit" },
                  { id: "u1-gr-ex-4-q1-b", text: "aren't fitting" },
                  { id: "u1-gr-ex-4-q1-c", text: "don't fitting" },
                ],
                correctOptionId: "u1-gr-ex-4-q1-a",
              },
              {
                id: "u1-gr-ex-4-q2",
                prompt: "they ___ my feet.",
                options: [
                  { id: "u1-gr-ex-4-q2-a", text: "is hurting" },
                  { id: "u1-gr-ex-4-q2-b", text: "hurt" },
                  { id: "u1-gr-ex-4-q2-c", text: "hurting" },
                ],
                correctOptionId: "u1-gr-ex-4-q2-b",
              },
              {
                id: "u1-gr-ex-4-q3",
                prompt: "I think I ___ a smaller size.",
                options: [
                  { id: "u1-gr-ex-4-q3-a", text: "needing" },
                  { id: "u1-gr-ex-4-q3-b", text: "need" },
                  { id: "u1-gr-ex-4-q3-c", text: "are needing" },
                ],
                correctOptionId: "u1-gr-ex-4-q3-b",
              },
              {
                id: "u1-gr-ex-4-q4",
                prompt: "What ___?'",
                options: [
                  { id: "u1-gr-ex-4-q4-a", text: "do you think" },
                  { id: "u1-gr-ex-4-q4-b", text: "does you think" },
                  { id: "u1-gr-ex-4-q4-c", text: "think you" },
                ],
                correctOptionId: "u1-gr-ex-4-q4-a",
              },
            ],
          },
          interaction: {
            xp: 10, retryable: true, shuffleOptions: false,
            scoringMode: "binary" as const, examMode: false,
          },
        },

        // ── Exercise 5/6: Grammar Gap-Select (Marc & Paul, Part 5) ───────────
        {
          type: "exercise" as const,
          id: "u1-gr-block-ex-5",
          exercise: {
            id: "u1-gr-ex-5",
            type: "gap_select" as const,
            label: "Grammar Exercise 5",
            description: "Continue reading. Complete each gap with the correct verb form.",
            questions: [
              {
                id: "u1-gr-ex-5-q1",
                prompt:
                  "Paul agrees, 'Try on another pair.' " +
                  "'Great!', Marc says, 'These ones really ___ me.",
                options: [
                  { id: "u1-gr-ex-5-q1-a", text: "suitting" },
                  { id: "u1-gr-ex-5-q1-b", text: "suiting" },
                  { id: "u1-gr-ex-5-q1-c", text: "suit" },
                ],
                correctOptionId: "u1-gr-ex-5-q1-c",
              },
              {
                id: "u1-gr-ex-5-q2",
                prompt: "How much ___?'",
                options: [
                  { id: "u1-gr-ex-5-q2-a", text: "they do cost" },
                  { id: "u1-gr-ex-5-q2-b", text: "are costing" },
                  { id: "u1-gr-ex-5-q2-c", text: "do they cost" },
                ],
                correctOptionId: "u1-gr-ex-5-q2-c",
              },
            ],
          },
          interaction: {
            xp: 10, retryable: true, shuffleOptions: false,
            scoringMode: "binary" as const, examMode: false,
          },
        },

        // ── Exercise 6/6: Grammar Gap-Select (Marc & Paul, Part 6) ───────────
        {
          type: "exercise" as const,
          id: "u1-gr-block-ex-6",
          exercise: {
            id: "u1-gr-ex-6",
            type: "gap_select" as const,
            label: "Grammar Exercise 6",
            description: "Continue reading. Complete each gap with the correct verb form.",
            questions: [
              {
                id: "u1-gr-ex-6-q1",
                prompt: "While Marc ___ for his shoes,",
                options: [
                  { id: "u1-gr-ex-6-q1-a", text: "is paying" },
                  { id: "u1-gr-ex-6-q1-b", text: "pay" },
                  { id: "u1-gr-ex-6-q1-c", text: "is pay" },
                ],
                correctOptionId: "u1-gr-ex-6-q1-a",
              },
              {
                id: "u1-gr-ex-6-q2",
                prompt: "Paul ___ a pair of shoes he really likes",
                options: [
                  { id: "u1-gr-ex-6-q2-a", text: "find" },
                  { id: "u1-gr-ex-6-q2-b", text: "finds" },
                  { id: "u1-gr-ex-6-q2-c", text: "are finding" },
                ],
                correctOptionId: "u1-gr-ex-6-q2-b",
              },
              {
                id: "u1-gr-ex-6-q3",
                prompt: "and ___ them.",
                options: [
                  { id: "u1-gr-ex-6-q3-a", text: "buy" },
                  { id: "u1-gr-ex-6-q3-b", text: "is buying" },
                  { id: "u1-gr-ex-6-q3-c", text: "buys" },
                ],
                correctOptionId: "u1-gr-ex-6-q3-c",
              },
            ],
          },
          interaction: {
            xp: 10, retryable: true, shuffleOptions: false,
            scoringMode: "binary" as const, examMode: false,
          },
        },

      ],
    },

    // =========================================================================
    // SECTION 2 — Vocabulary
    // Hobbies & Everyday Words
    // =========================================================================
    {
      id: "u1-s-vocabulary",
      skill: "vocabulary",
      title: "Vocabulary — Hobbies & Everyday Words",
      awardsProgress: true,
      blocks: [

        // ── Theory 1: Hobbies image card 1 ───────────────────────────────────
        {
          type: "theory" as const,
          id: "u1-voc-theory-1",
          heading: "Hobbies",
          body: [],
          image: {
            src: "https://dkmwdxc6g4lk7.cloudfront.net/courses/img/UNIT1-1.png",
            alt: "Illustrated vocabulary card showing common hobbies",
          },
        },

        // ── Theory 2: Hobbies image card 2 ───────────────────────────────────
        {
          type: "theory" as const,
          id: "u1-voc-theory-2",
          heading: "Hobbies",
          body: [],
          image: {
            src: "https://dkmwdxc6g4lk7.cloudfront.net/courses/img/UNIT1-2.png",
            alt: "Illustrated vocabulary card showing more hobbies",
          },
        },

        // ── Exercise 1: Vocabulary Gap-Select (word banks A & B) ─────────────
        // MN-004: Two disjoint word banks (Q1–5 = bank A, Q6–10 = bank B)
        {
          type: "exercise" as const,
          id: "u1-voc-block-ex-1",
          exercise: {
            id: "u1-voc-ex-1",
            type: "gap_select" as const,
            label: "Vocabulary Exercise 1",
            description:
              "Complete each sentence (1–10) using a word from the box. Do not use the same word twice.",
            wordBank: [
              "able", "attention", "sadly", "risks", "homework", "sour", "up", "know",
              "reply", "blockbuster", "booming", "opportunity", "dole", "house", "answering", "prison",
            ],
            questions: [
              // ── Bank A (questions 1–5)
              {
                id: "u1-voc-ex-1-q1",
                prompt: "1. You should pay ___ to the details.",
                options: [
                  { id: "u1-voc-ex-1-q1-a", text: "able" },
                  { id: "u1-voc-ex-1-q1-b", text: "attention" },
                  { id: "u1-voc-ex-1-q1-c", text: "sadly" },
                  { id: "u1-voc-ex-1-q1-d", text: "risks" },
                  { id: "u1-voc-ex-1-q1-e", text: "homework" },
                  { id: "u1-voc-ex-1-q1-f", text: "sour" },
                  { id: "u1-voc-ex-1-q1-g", text: "up" },
                  { id: "u1-voc-ex-1-q1-h", text: "know" },
                ],
                correctOptionId: "u1-voc-ex-1-q1-b",
              },
              {
                id: "u1-voc-ex-1-q2",
                prompt: "2. ___, the rate of unemployment is high in the region.",
                options: [
                  { id: "u1-voc-ex-1-q2-a", text: "able" },
                  { id: "u1-voc-ex-1-q2-b", text: "attention" },
                  { id: "u1-voc-ex-1-q2-c", text: "sadly" },
                  { id: "u1-voc-ex-1-q2-d", text: "risks" },
                  { id: "u1-voc-ex-1-q2-e", text: "homework" },
                  { id: "u1-voc-ex-1-q2-f", text: "sour" },
                  { id: "u1-voc-ex-1-q2-g", text: "up" },
                  { id: "u1-voc-ex-1-q2-h", text: "know" },
                ],
                correctOptionId: "u1-voc-ex-1-q2-c",
              },
              {
                id: "u1-voc-ex-1-q3",
                prompt: "3. Let me ___ as soon as possible.",
                options: [
                  { id: "u1-voc-ex-1-q3-a", text: "able" },
                  { id: "u1-voc-ex-1-q3-b", text: "attention" },
                  { id: "u1-voc-ex-1-q3-c", text: "sadly" },
                  { id: "u1-voc-ex-1-q3-d", text: "risks" },
                  { id: "u1-voc-ex-1-q3-e", text: "homework" },
                  { id: "u1-voc-ex-1-q3-f", text: "sour" },
                  { id: "u1-voc-ex-1-q3-g", text: "up" },
                  { id: "u1-voc-ex-1-q3-h", text: "know" },
                ],
                correctOptionId: "u1-voc-ex-1-q3-h",
              },
              {
                id: "u1-voc-ex-1-q4",
                prompt: "4. Cheesecake is sweet but lemons are ___.",
                options: [
                  { id: "u1-voc-ex-1-q4-a", text: "able" },
                  { id: "u1-voc-ex-1-q4-b", text: "attention" },
                  { id: "u1-voc-ex-1-q4-c", text: "sadly" },
                  { id: "u1-voc-ex-1-q4-d", text: "risks" },
                  { id: "u1-voc-ex-1-q4-e", text: "homework" },
                  { id: "u1-voc-ex-1-q4-f", text: "sour" },
                  { id: "u1-voc-ex-1-q4-g", text: "up" },
                  { id: "u1-voc-ex-1-q4-h", text: "know" },
                ],
                correctOptionId: "u1-voc-ex-1-q4-f",
              },
              {
                id: "u1-voc-ex-1-q5",
                prompt: "5. No matter how much he tries, he is not ___ to pass his driving test.",
                options: [
                  { id: "u1-voc-ex-1-q5-a", text: "able" },
                  { id: "u1-voc-ex-1-q5-b", text: "attention" },
                  { id: "u1-voc-ex-1-q5-c", text: "sadly" },
                  { id: "u1-voc-ex-1-q5-d", text: "risks" },
                  { id: "u1-voc-ex-1-q5-e", text: "homework" },
                  { id: "u1-voc-ex-1-q5-f", text: "sour" },
                  { id: "u1-voc-ex-1-q5-g", text: "up" },
                  { id: "u1-voc-ex-1-q5-h", text: "know" },
                ],
                correctOptionId: "u1-voc-ex-1-q5-a",
              },
              // ── Bank B (questions 6–10)
              {
                id: "u1-voc-ex-1-q6",
                prompt: "6. He is unemployed and on the ___.",
                options: [
                  { id: "u1-voc-ex-1-q6-a", text: "reply" },
                  { id: "u1-voc-ex-1-q6-b", text: "blockbuster" },
                  { id: "u1-voc-ex-1-q6-c", text: "booming" },
                  { id: "u1-voc-ex-1-q6-d", text: "opportunity" },
                  { id: "u1-voc-ex-1-q6-e", text: "dole" },
                  { id: "u1-voc-ex-1-q6-f", text: "house" },
                  { id: "u1-voc-ex-1-q6-g", text: "answering" },
                  { id: "u1-voc-ex-1-q6-h", text: "prison" },
                ],
                correctOptionId: "u1-voc-ex-1-q6-e",
              },
              {
                id: "u1-voc-ex-1-q7",
                prompt: "7. Burglars broke into her ___.",
                options: [
                  { id: "u1-voc-ex-1-q7-a", text: "reply" },
                  { id: "u1-voc-ex-1-q7-b", text: "blockbuster" },
                  { id: "u1-voc-ex-1-q7-c", text: "booming" },
                  { id: "u1-voc-ex-1-q7-d", text: "opportunity" },
                  { id: "u1-voc-ex-1-q7-e", text: "dole" },
                  { id: "u1-voc-ex-1-q7-f", text: "house" },
                  { id: "u1-voc-ex-1-q7-g", text: "answering" },
                  { id: "u1-voc-ex-1-q7-h", text: "prison" },
                ],
                correctOptionId: "u1-voc-ex-1-q7-f",
              },
              {
                id: "u1-voc-ex-1-q8",
                prompt: "8. The new film is a ___.",
                options: [
                  { id: "u1-voc-ex-1-q8-a", text: "reply" },
                  { id: "u1-voc-ex-1-q8-b", text: "blockbuster" },
                  { id: "u1-voc-ex-1-q8-c", text: "booming" },
                  { id: "u1-voc-ex-1-q8-d", text: "opportunity" },
                  { id: "u1-voc-ex-1-q8-e", text: "dole" },
                  { id: "u1-voc-ex-1-q8-f", text: "house" },
                  { id: "u1-voc-ex-1-q8-g", text: "answering" },
                  { id: "u1-voc-ex-1-q8-h", text: "prison" },
                ],
                correctOptionId: "u1-voc-ex-1-q8-b",
              },
              {
                id: "u1-voc-ex-1-q9",
                prompt: "9. Don't miss this fantastic ___, you might not get another one.",
                options: [
                  { id: "u1-voc-ex-1-q9-a", text: "reply" },
                  { id: "u1-voc-ex-1-q9-b", text: "blockbuster" },
                  { id: "u1-voc-ex-1-q9-c", text: "booming" },
                  { id: "u1-voc-ex-1-q9-d", text: "opportunity" },
                  { id: "u1-voc-ex-1-q9-e", text: "dole" },
                  { id: "u1-voc-ex-1-q9-f", text: "house" },
                  { id: "u1-voc-ex-1-q9-g", text: "answering" },
                  { id: "u1-voc-ex-1-q9-h", text: "prison" },
                ],
                correctOptionId: "u1-voc-ex-1-q9-d",
              },
              {
                id: "u1-voc-ex-1-q10",
                prompt: "10. I look forward to your ___.",
                options: [
                  { id: "u1-voc-ex-1-q10-a", text: "reply" },
                  { id: "u1-voc-ex-1-q10-b", text: "blockbuster" },
                  { id: "u1-voc-ex-1-q10-c", text: "booming" },
                  { id: "u1-voc-ex-1-q10-d", text: "opportunity" },
                  { id: "u1-voc-ex-1-q10-e", text: "dole" },
                  { id: "u1-voc-ex-1-q10-f", text: "house" },
                  { id: "u1-voc-ex-1-q10-g", text: "answering" },
                  { id: "u1-voc-ex-1-q10-h", text: "prison" },
                ],
                correctOptionId: "u1-voc-ex-1-q10-a",
              },
            ],
          },
          interaction: {
            xp: 10, retryable: true, shuffleOptions: false,
            scoringMode: "binary" as const, examMode: false,
          },
        },

        // ── Exercise 2: Vocabulary Collocations (word bank C) ─────────────────
        {
          type: "exercise" as const,
          id: "u1-voc-block-ex-2",
          exercise: {
            id: "u1-voc-ex-2",
            type: "gap_select" as const,
            label: "Vocabulary Exercise 2",
            description:
              "Write the letter of the word on the right (A–H) that best collocates with " +
              "the word on the left (11–15). Do not use the same word twice.",
            wordBank: ["minded", "fish", "bustle", "analysis", "part", "log", "cats", "air"],
            questions: [
              {
                id: "u1-voc-ex-2-q1",
                prompt: "11. hustle and ___",
                options: [
                  { id: "u1-voc-ex-2-q1-a", text: "minded" },
                  { id: "u1-voc-ex-2-q1-b", text: "fish" },
                  { id: "u1-voc-ex-2-q1-c", text: "bustle" },
                  { id: "u1-voc-ex-2-q1-d", text: "analysis" },
                  { id: "u1-voc-ex-2-q1-e", text: "part" },
                  { id: "u1-voc-ex-2-q1-f", text: "log" },
                  { id: "u1-voc-ex-2-q1-g", text: "cats" },
                  { id: "u1-voc-ex-2-q1-h", text: "air" },
                ],
                correctOptionId: "u1-voc-ex-2-q1-c",
              },
              {
                id: "u1-voc-ex-2-q2",
                prompt: "12. take ___",
                options: [
                  { id: "u1-voc-ex-2-q2-a", text: "minded" },
                  { id: "u1-voc-ex-2-q2-b", text: "fish" },
                  { id: "u1-voc-ex-2-q2-c", text: "bustle" },
                  { id: "u1-voc-ex-2-q2-d", text: "analysis" },
                  { id: "u1-voc-ex-2-q2-e", text: "part" },
                  { id: "u1-voc-ex-2-q2-f", text: "log" },
                  { id: "u1-voc-ex-2-q2-g", text: "cats" },
                  { id: "u1-voc-ex-2-q2-h", text: "air" },
                ],
                correctOptionId: "u1-voc-ex-2-q2-e",
              },
              {
                id: "u1-voc-ex-2-q3",
                prompt: "13. raw ___",
                options: [
                  { id: "u1-voc-ex-2-q3-a", text: "minded" },
                  { id: "u1-voc-ex-2-q3-b", text: "fish" },
                  { id: "u1-voc-ex-2-q3-c", text: "bustle" },
                  { id: "u1-voc-ex-2-q3-d", text: "analysis" },
                  { id: "u1-voc-ex-2-q3-e", text: "part" },
                  { id: "u1-voc-ex-2-q3-f", text: "log" },
                  { id: "u1-voc-ex-2-q3-g", text: "cats" },
                  { id: "u1-voc-ex-2-q3-h", text: "air" },
                ],
                correctOptionId: "u1-voc-ex-2-q3-b",
              },
              {
                id: "u1-voc-ex-2-q4",
                prompt: "14. narrow ___",
                options: [
                  { id: "u1-voc-ex-2-q4-a", text: "minded" },
                  { id: "u1-voc-ex-2-q4-b", text: "fish" },
                  { id: "u1-voc-ex-2-q4-c", text: "bustle" },
                  { id: "u1-voc-ex-2-q4-d", text: "analysis" },
                  { id: "u1-voc-ex-2-q4-e", text: "part" },
                  { id: "u1-voc-ex-2-q4-f", text: "log" },
                  { id: "u1-voc-ex-2-q4-g", text: "cats" },
                  { id: "u1-voc-ex-2-q4-h", text: "air" },
                ],
                correctOptionId: "u1-voc-ex-2-q4-a",
              },
              {
                id: "u1-voc-ex-2-q5",
                prompt: "15. cabin ___",
                options: [
                  { id: "u1-voc-ex-2-q5-a", text: "minded" },
                  { id: "u1-voc-ex-2-q5-b", text: "fish" },
                  { id: "u1-voc-ex-2-q5-c", text: "bustle" },
                  { id: "u1-voc-ex-2-q5-d", text: "analysis" },
                  { id: "u1-voc-ex-2-q5-e", text: "part" },
                  { id: "u1-voc-ex-2-q5-f", text: "log" },
                  { id: "u1-voc-ex-2-q5-g", text: "cats" },
                  { id: "u1-voc-ex-2-q5-h", text: "air" },
                ],
                correctOptionId: "u1-voc-ex-2-q5-f",
              },
            ],
          },
          interaction: {
            xp: 10, retryable: true, shuffleOptions: false,
            scoringMode: "binary" as const, examMode: false,
          },
        },

      ],
    },

    // =========================================================================
    // SECTION 3 — Listening
    // =========================================================================
    {
      id: "u1-s-listening",
      skill: "listening",
      title: "Listening — Short Recordings",
      awardsProgress: true,
      blocks: [

        // ── Exercise 1: Pete's trip to Peru ───────────────────────────────────
        {
          type: "exercise" as const,
          id: "u1-ls-block-ex-1",
          exercise: {
            id: "u1-ls-ex-1",
            type: "listening_select" as const,
            label: "Listening Exercise 1",
            description:
              "You will hear a short recording twice. Listen to Pete and Dale " +
              "talk about Pete's trip to Peru. What surprised Pete most?",
            audio: {
              src: "https://dkmwdxc6g4lk7.cloudfront.net/Q7-11.mp3",
              mimeType: "audio/mpeg",
              transcript:
                "A: Pete, hi! How was your trip to Peru? " +
                "B: Hi, Dale! Yeah, it was brilliant! I got to pet an alpaca! " +
                "A: No way! " +
                "B: Yeah, and the nature was incredible. We took a boat trip in the Amazon " +
                "rainforest and later on we hiked Machu Picchu! It was amazing. " +
                "A: Sounds like it! What surprised you the most in Peru? The food? " +
                "B: No, I'd say it was the people, really! They were so kind and welcoming. " +
                "They made us feel right at home!",
            },
            questions: [
              {
                id: "u1-ls-ex-1-q1",
                prompt: "What surprised Pete most on his trip to Peru?",
                options: [
                  { id: "u1-ls-ex-1-q1-a", text: "The people" },
                  { id: "u1-ls-ex-1-q1-b", text: "The nature" },
                  { id: "u1-ls-ex-1-q1-c", text: "The boat trip" },
                  { id: "u1-ls-ex-1-q1-d", text: "The food" },
                ],
                correctOptionId: "u1-ls-ex-1-q1-a",
              },
            ],
          },
          interaction: {
            xp: 10, retryable: false, shuffleOptions: false,
            scoringMode: "binary" as const, examMode: false,
          },
        },

        // ── Exercise 2: Tonight's party ───────────────────────────────────────
        {
          type: "exercise" as const,
          id: "u1-ls-block-ex-2",
          exercise: {
            id: "u1-ls-ex-2",
            type: "listening_select" as const,
            label: "Listening Exercise 2",
            description:
              "You will hear a short recording twice. Listen to the man talking about " +
              "tonight's party. What activity will he do first to prepare?",
            audio: {
              src: "https://dkmwdxc6g4lk7.cloudfront.net/Q7-19.mp3",
              mimeType: "audio/mpeg",
              transcript:
                "I've still got so much to get done for tonight's party! Where can I start? " +
                "There's a lot to prepare for the meal still, but I shouldn't start with " +
                "the cooking or the food will get cold. I don't even have all the ingredients! " +
                "So, I guess shopping will be first. And oh, the living room's a mess. " +
                "I'll have to clean at some point. And then that just leaves setting up the games! " +
                "That part shouldn't take too long.",
            },
            questions: [
              {
                id: "u1-ls-ex-2-q1",
                prompt: "What activity will he do first to prepare for the party?",
                options: [
                  { id: "u1-ls-ex-2-q1-a", text: "Go shopping" },
                  { id: "u1-ls-ex-2-q1-b", text: "Cook" },
                  { id: "u1-ls-ex-2-q1-c", text: "Set up games" },
                  { id: "u1-ls-ex-2-q1-d", text: "Clean" },
                ],
                correctOptionId: "u1-ls-ex-2-q1-a",
              },
            ],
          },
          interaction: {
            xp: 10, retryable: false, shuffleOptions: false,
            scoringMode: "binary" as const, examMode: false,
          },
        },

      ],
    },

    // =========================================================================
    // SECTION 4 — Speaking
    // =========================================================================
    {
      id: "u1-s-speaking",
      skill: "speaking",
      title: "Speaking — Daily Routines",
      awardsProgress: true,
      blocks: [

        // ── Theory 1: Daily Routines Verbs ───────────────────────────────────
        {
          type: "theory" as const,
          id: "u1-sp-theory-1",
          heading: "Daily Routines Verbs",
          body: [
            {
              type: "heading" as const,
              level: 3,
              children: [{ text: "Morning & Weekday Routine" }],
            },
            {
              type: "list" as const,
              ordered: false,
              items: [
                { type: "list_item" as const, children: [{ text: "wake up" }] },
                { type: "list_item" as const, children: [{ text: "get up" }] },
                { type: "list_item" as const, children: [{ text: "have a shower" }] },
                { type: "list_item" as const, children: [{ text: "have breakfast" }] },
                { type: "list_item" as const, children: [{ text: "brush my teeth" }] },
                { type: "list_item" as const, children: [{ text: "leave home" }] },
                { type: "list_item" as const, children: [{ text: "go to school / work" }] },
                { type: "list_item" as const, children: [{ text: "go home" }] },
                { type: "list_item" as const, children: [{ text: "have lunch" }] },
                { type: "list_item" as const, children: [{ text: "have a nap / siesta" }] },
                { type: "list_item" as const, children: [{ text: "do the housework" }] },
                { type: "list_item" as const, children: [{ text: "take the bus / underground" }] },
                { type: "list_item" as const, children: [{ text: "go to English / painting class" }] },
                { type: "list_item" as const, children: [{ text: "do sport / go to the gym" }] },
                { type: "list_item" as const, children: [{ text: "go for a walk" }] },
                { type: "list_item" as const, children: [{ text: "study" }] },
                { type: "list_item" as const, children: [{ text: "play computer games or browse the internet" }] },
                { type: "list_item" as const, children: [{ text: "have dinner" }] },
                { type: "list_item" as const, children: [{ text: "walk the dog" }] },
                { type: "list_item" as const, children: [{ text: "have a bath" }] },
                { type: "list_item" as const, children: [{ text: "watch TV" }] },
                { type: "list_item" as const, children: [{ text: "relax on the couch" }] },
                { type: "list_item" as const, children: [{ text: "switch off the lights" }] },
                { type: "list_item" as const, children: [{ text: "go to bed" }] },
              ],
            },
            {
              type: "heading" as const,
              level: 3,
              children: [{ text: "Weekend Activities" }],
            },
            {
              type: "list" as const,
              ordered: false,
              items: [
                { type: "list_item" as const, children: [{ text: "go out with friends" }] },
                { type: "list_item" as const, children: [{ text: "hang out with friends" }] },
                { type: "list_item" as const, children: [{ text: "go to the cinema" }] },
                { type: "list_item" as const, children: [{ text: "play football" }] },
                { type: "list_item" as const, children: [{ text: "go for a walk" }] },
                { type: "list_item" as const, children: [{ text: "eat out" }] },
                { type: "list_item" as const, children: [{ text: "meet up with my friends" }] },
              ],
            },
          ],
          image: {
            src: "https://dkmwdxc6g4lk7.cloudfront.net/courses/img/speaking/UNIT-1.jpg",
            alt: "Illustration of daily routine activities",
          },
        },

        // ── Exercise 1: Speaking Part 2 (audio-prompted, with images) ─────────
        // MN-006: Each question has its own audio cue; image is shared across questions
        {
          type: "exercise" as const,
          id: "u1-sp-block-ex-1",
          exercise: {
            id: "u1-sp-ex-1",
            type: "speaking_image" as const,
            label: "Speaking Part 2",
            description:
              "In this part, I'm going to ask you three short questions about yourself " +
              "and your interests. You will have 30 seconds to reply to each question.",
            recordingTimeSec: 30,
            questions: [
              {
                id: "u1-sp-ex-1-q1",
                prompt: "What are you doing this weekend?",
                audio: {
                  src: "https://dkmwdxc6g4lk7.cloudfront.net/U1-1.mp3",
                  mimeType: "audio/mpeg",
                },
                image: {
                  src: "https://dkmwdxc6g4lk7.cloudfront.net/courses/img/speaking/UNIT-1-2.jpg",
                  alt: "Image prompt: weekend activities",
                },
              },
              {
                id: "u1-sp-ex-1-q2",
                prompt: "What hobbies would you like to take up?",
                audio: {
                  src: "https://dkmwdxc6g4lk7.cloudfront.net/U1-2.mp3",
                  mimeType: "audio/mpeg",
                },
                image: {
                  src: "https://dkmwdxc6g4lk7.cloudfront.net/courses/img/speaking/UNIT-1-2.jpg",
                  alt: "Image prompt: hobbies",
                },
              },
              {
                id: "u1-sp-ex-1-q3",
                prompt: "Do you have a lot of free time?",
                audio: {
                  src: "https://dkmwdxc6g4lk7.cloudfront.net/U1-3.mp3",
                  mimeType: "audio/mpeg",
                },
                image: {
                  src: "https://dkmwdxc6g4lk7.cloudfront.net/courses/img/speaking/UNIT-1-2.jpg",
                  alt: "Image prompt: free time",
                },
              },
            ],
          },
          interaction: {
            xp: 25, retryable: false, shuffleOptions: false,
            scoringMode: "rubric" as const, examMode: false,
          },
          review: { mode: "hybrid" as const },
        },

        // ── Exercise 2: Speaking Part 1, set A (text-only prompts) ───────────
        // MN-005: No audio cues (recordingUrl: null in legacy source)
        {
          type: "exercise" as const,
          id: "u1-sp-block-ex-2",
          exercise: {
            id: "u1-sp-ex-2",
            type: "speaking_open" as const,
            label: "Speaking Practice",
            description: "Answer each question. You will have 30 seconds to reply.",
            recordingTimeSec: 30,
            questions: [
              { id: "u1-sp-ex-2-q1", prompt: "What's your favourite animal?" },
              { id: "u1-sp-ex-2-q2", prompt: "What's your house like?" },
              { id: "u1-sp-ex-2-q3", prompt: "What's your favourite season or day of the week?" },
              { id: "u1-sp-ex-2-q4", prompt: "What type of holiday do you prefer?" },
              { id: "u1-sp-ex-2-q5", prompt: "What do you do?" },
            ],
          },
          interaction: {
            xp: 25, retryable: false, shuffleOptions: false,
            scoringMode: "rubric" as const, examMode: false,
          },
          review: { mode: "hybrid" as const },
        },

        // ── Exercise 3: Speaking Part 1, set B (text-only prompts) ───────────
        {
          type: "exercise" as const,
          id: "u1-sp-block-ex-3",
          exercise: {
            id: "u1-sp-ex-3",
            type: "speaking_open" as const,
            label: "More Speaking Practice",
            description: "Answer each question. You will have 30 seconds to reply.",
            recordingTimeSec: 30,
            questions: [
              { id: "u1-sp-ex-3-q1", prompt: "Is time more valuable than money?" },
              { id: "u1-sp-ex-3-q2", prompt: "How many brothers and sisters have you got?" },
              { id: "u1-sp-ex-3-q3", prompt: "How do you feel today?" },
              { id: "u1-sp-ex-3-q4", prompt: "What's your mobile phone like?" },
              { id: "u1-sp-ex-3-q5", prompt: "What would you do if you had more spare time?" },
            ],
          },
          interaction: {
            xp: 25, retryable: false, shuffleOptions: false,
            scoringMode: "rubric" as const, examMode: false,
          },
          review: { mode: "hybrid" as const },
        },

        // ── Exercise 4: Speaking Part 1, set C (text-only prompts) ───────────
        {
          type: "exercise" as const,
          id: "u1-sp-block-ex-4",
          exercise: {
            id: "u1-sp-ex-4",
            type: "speaking_open" as const,
            label: "More Speaking Practice",
            description: "Answer each question. You will have 30 seconds to reply.",
            recordingTimeSec: 30,
            questions: [
              { id: "u1-sp-ex-4-q1", prompt: "Do you have a large family?" },
              { id: "u1-sp-ex-4-q2", prompt: "Who is your best friend?" },
              { id: "u1-sp-ex-4-q3", prompt: "Do you work or are you a student?" },
              { id: "u1-sp-ex-4-q4", prompt: "What are your plans for the future?" },
              { id: "u1-sp-ex-4-q5", prompt: "What are you doing next weekend?" },
              { id: "u1-sp-ex-4-q6", prompt: "What's your favourite dish?" },
            ],
          },
          interaction: {
            xp: 25, retryable: false, shuffleOptions: false,
            scoringMode: "rubric" as const, examMode: false,
          },
          review: { mode: "hybrid" as const },
        },

      ],
    },

    // =========================================================================
    // SECTION 5 — Reading
    // A Day in the Life of a Teenager
    // MN-007: Theory and exercise blocks interleave; order is preserved.
    // =========================================================================
    {
      id: "u1-s-reading",
      skill: "reading",
      title: "Reading — A Day in the Life of a Teenager",
      awardsProgress: true,
      blocks: [

        // ── Theory 1: Morning passage ─────────────────────────────────────────
        {
          type: "theory" as const,
          id: "u1-rd-theory-1",
          title: "A day in the life of a teenager",
          heading: "In the morning",
          body: [
            {
              type: "paragraph" as const,
              children: [{ text: "Hello there," }],
            },
            {
              type: "paragraph" as const,
              children: [
                { text: "Let me introduce myself. My name is Raphael and I live in Durham, in the north-east of England." },
              ],
            },
            {
              type: "paragraph" as const,
              children: [
                { text: "On weekdays, I get up at 7:30am and make my bed quickly. After getting dressed, I go downstairs and prepare my breakfast. I like to have a bowl of cereal, toast with butter and a mug of hot milk. Mind you, when it starts getting warmer I switch to cold milk or a milkshake." },
              ],
            },
            {
              type: "paragraph" as const,
              children: [
                { text: "You know what? I have a pet canary. My mum has taught me to clean out its cage every morning. I need to get the dirt out. Also, I have to clean up the mess outside. Like most birds, he throws the husks out of his cage. Husks must be cleaned, otherwise Mum gets upset." },
              ],
            },
            {
              type: "paragraph" as const,
              children: [
                { text: "I say goodbye to Bartol, my canary, and I grab my backpack. After checking everything I need for the day is inside, I head to school. I needn't take the bus since my home is just round the corner from the school. I'm really lucky that way. If I lived a long way from school, I'd have to wake up much earlier, which I am not too fond of!" },
              ],
            },
            {
              type: "paragraph" as const,
              children: [
                { text: "School is hard work but I'm proud of being part of such an excellent institution. It was awarded a prize last year for being rated 'excellent' and top of the list of schools in the area in terms of quality and students' grades." },
              ],
            },
            {
              type: "paragraph" as const,
              children: [
                { text: "At school, I have a break at 10.30am. I go out into the playground and have some fun with my mates. We like to play either marbles or catch. The day goes quickly and before we know it we are packing up our books and tidying our desks at 3.00pm, ready to go home." },
              ],
            },
          ],
        },

        // ── Exercise 1: True/False ────────────────────────────────────────────
        {
          type: "exercise" as const,
          id: "u1-rd-block-ex-1",
          exercise: {
            id: "u1-rd-ex-1",
            type: "true_false" as const,
            label: "Reading Exercise 1",
            description: "Read the text carefully and say if the following statements are true or false.",
            questions: [
              {
                id: "u1-rd-ex-1-q1",
                prompt: "1. Raphael has breakfast in the kitchen next to his bedroom.",
                options: [
                  { id: "u1-rd-ex-1-q1-t", text: "True" },
                  { id: "u1-rd-ex-1-q1-f", text: "False" },
                ],
                correctOptionId: "u1-rd-ex-1-q1-f",
              },
              {
                id: "u1-rd-ex-1-q2",
                prompt: "2. He always has a glass of hot milk.",
                options: [
                  { id: "u1-rd-ex-1-q2-t", text: "True" },
                  { id: "u1-rd-ex-1-q2-f", text: "False" },
                ],
                correctOptionId: "u1-rd-ex-1-q2-f",
              },
              {
                id: "u1-rd-ex-1-q3",
                prompt: "3. His bird doesn't eat many husks.",
                options: [
                  { id: "u1-rd-ex-1-q3-t", text: "True" },
                  { id: "u1-rd-ex-1-q3-f", text: "False" },
                ],
                correctOptionId: "u1-rd-ex-1-q3-t",
              },
              {
                id: "u1-rd-ex-1-q4",
                prompt: "4. He is glad he lives so close to school.",
                options: [
                  { id: "u1-rd-ex-1-q4-t", text: "True" },
                  { id: "u1-rd-ex-1-q4-f", text: "False" },
                ],
                correctOptionId: "u1-rd-ex-1-q4-t",
              },
              {
                id: "u1-rd-ex-1-q5",
                prompt: "5. His school has a rating of 'good'.",
                options: [
                  { id: "u1-rd-ex-1-q5-t", text: "True" },
                  { id: "u1-rd-ex-1-q5-f", text: "False" },
                ],
                correctOptionId: "u1-rd-ex-1-q5-f",
              },
              {
                id: "u1-rd-ex-1-q6",
                prompt: "6. Raphael and his friends like to play basketball during their break.",
                options: [
                  { id: "u1-rd-ex-1-q6-t", text: "True" },
                  { id: "u1-rd-ex-1-q6-f", text: "False" },
                ],
                correctOptionId: "u1-rd-ex-1-q6-f",
              },
            ],
          },
          interaction: {
            xp: 10, retryable: true, shuffleOptions: false,
            scoringMode: "binary" as const, examMode: false,
          },
        },

        // ── Theory 2: Afternoon & evening passage ─────────────────────────────
        {
          type: "theory" as const,
          id: "u1-rd-theory-2",
          title: "A day in the life of a teenager",
          heading: "In the afternoon and evening",
          body: [
            {
              type: "paragraph" as const,
              children: [
                { text: "Dinner is usually waiting for me at home. I also help Mum with the housework. My job is to empty the dishwasher and put the plates away." },
              ],
            },
            {
              type: "paragraph" as const,
              children: [
                { text: "After that, I do my homework. My best friend Tom usually struggles with maths and science in class, so he needs to have a private tutor. This means that he doesn't go out on Mondays and Wednesdays after school. However, on the other weekdays we meet up and play football with a local club." },
              ],
            },
            {
              type: "paragraph" as const,
              children: [
                { text: "We are really into football. Our coach has always talked us into doing our best. Tom is a goalkeeper and I play midfield. We want to be professional football players. Time will tell, I guess." },
              ],
            },
            {
              type: "paragraph" as const,
              children: [
                { text: "I'm back home by around 8p.m. I have a shower and put on my pyjamas. Before going to bed I play computer games for an hour. I set my alarm clock, get into bed and usually sleep like a log." },
              ],
            },
          ],
        },

        // ── Exercise 2: Multiple Choice ───────────────────────────────────────
        {
          type: "exercise" as const,
          id: "u1-rd-block-ex-2",
          exercise: {
            id: "u1-rd-ex-2",
            type: "multiple_choice" as const,
            label: "Reading Exercise 2",
            description: "Choose the correct option: A, B, C, or D.",
            questions: [
              {
                id: "u1-rd-ex-2-q1",
                prompt: "1. Before doing his homework...",
                options: [
                  { id: "u1-rd-ex-2-q1-a", text: "Raphael does all of the housework" },
                  { id: "u1-rd-ex-2-q1-b", text: "Raphael washes the dishes" },
                  { id: "u1-rd-ex-2-q1-c", text: "Raphael helps his Mum with the washing" },
                  { id: "u1-rd-ex-2-q1-d", text: "Raphael puts the plates in the cupboards" },
                ],
                correctOptionId: "u1-rd-ex-2-q1-d",
              },
              {
                id: "u1-rd-ex-2-q2",
                prompt: "2. Raphael's football coach...",
                options: [
                  { id: "u1-rd-ex-2-q2-a", text: "forces him to train really hard" },
                  { id: "u1-rd-ex-2-q2-b", text: "told him that he needs to improve his skills" },
                  { id: "u1-rd-ex-2-q2-c", text: "convinced him to do his best" },
                  { id: "u1-rd-ex-2-q2-d", text: "wants him to become a famous footballer" },
                ],
                correctOptionId: "u1-rd-ex-2-q2-c",
              },
            ],
          },
          interaction: {
            xp: 10, retryable: true, shuffleOptions: false,
            scoringMode: "binary" as const, examMode: false,
          },
        },

      ],
    },

    // =========================================================================
    // SECTION 6 — Writing
    // =========================================================================
    {
      id: "u1-s-writing",
      skill: "writing",
      title: "Writing — Forms & Short Paragraphs",
      awardsProgress: true,
      blocks: [

        // ── Exercise 1: Writing Part 1 — Form ────────────────────────────────
        // MN-010: Field labels cleaned from "Name: {x}" to "Name"
        {
          type: "exercise" as const,
          id: "u1-wr-block-ex-1",
          exercise: {
            id: "u1-wr-ex-1",
            type: "writing_form" as const,
            label: "Writing Part 1",
            description: "You are joining a pet owners club. Fill in the form. (1–5 words per field)",
            wordLimit: "1–5 words",
            questions: [
              { id: "u1-wr-ex-1-f1", prompt: "Name" },
              { id: "u1-wr-ex-1-f2", prompt: "Surname" },
              { id: "u1-wr-ex-1-f3", prompt: "Address" },
              { id: "u1-wr-ex-1-f4", prompt: "Town / City" },
              { id: "u1-wr-ex-1-f5", prompt: "State / Country" },
              { id: "u1-wr-ex-1-f6", prompt: "Email" },
              { id: "u1-wr-ex-1-f7", prompt: "What's your favourite pet?" },
              { id: "u1-wr-ex-1-f8", prompt: "How many pets do you have?" },
              { id: "u1-wr-ex-1-f9", prompt: "Why are pets important to you?" },
            ],
          },
          interaction: {
            xp: 10, retryable: true, shuffleOptions: false,
            scoringMode: "unscored" as const, examMode: false,
          },
          review: { mode: "human" as const },
        },

        // ── Exercise 2: Writing Part 2 — Open paragraph ───────────────────────
        {
          type: "exercise" as const,
          id: "u1-wr-block-ex-2",
          exercise: {
            id: "u1-wr-ex-2",
            type: "writing_open" as const,
            label: "Writing Part 2",
            description: "Tell us what days and times the meetings suit you best.",
            wordRange: { min: 20, max: 30 },
            questions: [
              { id: "u1-wr-ex-2-q1", prompt: "" },
            ],
          },
          interaction: {
            xp: 20, retryable: false, shuffleOptions: false,
            scoringMode: "rubric" as const, examMode: false,
          },
          review: { mode: "human" as const },
        },

      ],
    },

  ],
} satisfies Unit;
