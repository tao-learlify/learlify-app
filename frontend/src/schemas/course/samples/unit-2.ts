// =============================================================================
// Unit 2 — Housing & Accommodation: Full Migration to Schema v2
// =============================================================================
//
// Source: aptis-course.json → views[1]
// Schema: src/schemas/course/* (v2)
//
// MIGRATION NOTES
// ───────────────
// MN-001  Grammar section focuses on comparatives and superlatives for
//         describing properties and accommodations.
//
// MN-002  Vocabulary covers housing types, furniture, rooms, and amenities.
//
// MN-003  Listening exercises involve conversations about finding homes,
//         property descriptions, and rental inquiries.
//
// MN-004  Speaking tasks include describing a house, negotiating terms,
//         and expressing preferences about accommodation.
//
// MN-005  Reading passages discuss various housing options, rental markets,
//         and home improvement topics.
//
// MN-006  Writing section includes describing a property and writing
//         accommodation inquiries or reviews.
// =============================================================================

import type { Unit } from "../hierarchy";

export const unit2 = {
  id: "unit-2",
  order: 2,
  title: "Unit 2 — Housing & Accommodation",
  subtitle: "Describing homes, finding accommodation, and discussing properties",
  learningObjective:
    "By the end of this unit you will be able to describe different types of " +
    "accommodation, compare properties using comparatives and superlatives, " +
    "discuss housing features and amenities, and negotiate rental or purchase terms.",
  estimatedDurationMin: 90,
  difficulty: "A2",
  theme: {
    name: "Housing & Accommodation",
    accent: "#F59E0B",
    accentSoft: "#FEF3C7",
    surface: "#FFFBEB",
    icon: "home",
    mood: "comfortable",
  },
  sections: [
    // =========================================================================
    // SECTION 1 — Grammar: Comparatives & Superlatives
    // =========================================================================
    {
      id: "u2-s-grammar",
      skill: "grammar",
      title: "Grammar — Comparatives & Superlatives",
      awardsProgress: true,
      blocks: [
        {
          type: "theory" as const,
          id: "u2-gr-theory-1",
          heading: "Comparative Adjectives",
          body: [
            {
              type: "paragraph" as const,
              children: [
                { text: "Use comparatives to compare two things. Add " },
                { text: "-er", bold: true },
                { text: " to short adjectives or use " },
                { text: "more", bold: true },
                { text: " with long adjectives." },
              ],
            },
            {
              type: "conjugation_table" as const,
              label: "Comparative Formation",
              rows: [
                { subject: "short (1 syllable)", form: "bigger, smaller, larger" },
                { subject: "long (2+ syllables)", form: "more spacious, more modern" },
                { subject: "irregular", form: "better, worse, more" },
              ],
            },
            {
              type: "paragraph" as const,
              children: [
                { text: "Example: This apartment is " },
                { text: "bigger than", bold: true },
                { text: " that one." },
              ],
            },
          ],
        },
        {
          type: "theory" as const,
          id: "u2-gr-theory-2",
          heading: "Superlative Adjectives",
          body: [
            {
              type: "paragraph" as const,
              children: [
                { text: "Use superlatives to compare three or more things. Add " },
                { text: "-est", bold: true },
                { text: " to short adjectives or use " },
                { text: "most", bold: true },
                { text: " with long adjectives." },
              ],
            },
            {
              type: "list" as const,
              ordered: false,
              items: [
                { type: "list_item" as const, children: [{ text: "This is the biggest house on the street." }] },
                { type: "list_item" as const, children: [{ text: "That is the most expensive apartment." }] },
                { type: "list_item" as const, children: [{ text: "These are the best value properties." }] },
              ],
            },
          ],
        },
        {
          type: "exercise" as const,
          id: "u2-gr-ex-1",
          exercise: {
            id: "u2-gr-ex-1",
            type: "gap_select" as const,
            label: "Comparative Exercise 1",
            description: "Complete the sentences with the correct comparative form.",
            questions: [
              {
                id: "u2-gr-ex-1-q1",
                prompt: "This house is ___ than my apartment. (big)",
                options: ["bigger", "biggest", "more big", "more bigger"],
                correctIndex: 0,
              },
              {
                id: "u2-gr-ex-1-q2",
                prompt: "The countryside is ___ than the city. (peaceful)",
                options: ["peaceful", "more peaceful", "peacefuler", "most peaceful"],
                correctIndex: 1,
              },
              {
                id: "u2-gr-ex-1-q3",
                prompt: "A villa is ___ than an apartment. (spacious)",
                options: ["spacious", "spaciouser", "more spacious", "most spacious"],
                correctIndex: 2,
              },
            ],
          },
        },
        {
          type: "exercise" as const,
          id: "u2-gr-ex-2",
          exercise: {
            id: "u2-gr-ex-2",
            type: "gap_select" as const,
            label: "Superlative Exercise 1",
            description: "Complete with the correct superlative form.",
            questions: [
              {
                id: "u2-gr-ex-2-q1",
                prompt: "This is the ___ apartment I've ever seen. (expensive)",
                options: ["expensivest", "most expensive", "more expensive", "expensive"],
                correctIndex: 1,
              },
              {
                id: "u2-gr-ex-2-q2",
                prompt: "That neighborhood has the ___ schools in the region. (good)",
                options: ["goodest", "better", "best", "most good"],
                correctIndex: 2,
              },
            ],
          },
        },
      ],
    },

    // =========================================================================
    // SECTION 2 — Vocabulary: Housing & Amenities
    // =========================================================================
    {
      id: "u2-s-vocabulary",
      skill: "vocabulary",
      title: "Vocabulary — Housing & Amenities",
      awardsProgress: true,
      blocks: [
        {
          type: "theory" as const,
          id: "u2-vo-theory-1",
          heading: "Types of Accommodation",
          body: [
            {
              type: "list" as const,
              ordered: false,
              items: [
                { type: "list_item" as const, children: [{ text: "House — detached or semi-detached building" }] },
                { type: "list_item" as const, children: [{ text: "Apartment/Flat — unit in a multi-story building" }] },
                { type: "list_item" as const, children: [{ text: "Cottage — small house, often in rural areas" }] },
                { type: "list_item" as const, children: [{ text: "Villa — large house with grounds" }] },
                { type: "list_item" as const, children: [{ text: "Studio — one-room apartment with kitchenette" }] },
              ],
            },
          ],
        },
        {
          type: "theory" as const,
          id: "u2-vo-theory-2",
          heading: "Home Amenities & Features",
          body: [
            {
              type: "list" as const,
              ordered: false,
              items: [
                { type: "list_item" as const, children: [{ text: "Garden/Yard — outdoor space" }] },
                { type: "list_item" as const, children: [{ text: "Garage — covered parking" }] },
                { type: "list_item" as const, children: [{ text: "Balcony/Patio — outdoor terrace" }] },
                { type: "list_item" as const, children: [{ text: "Pool — swimming facility" }] },
                { type: "list_item" as const, children: [{ text: "Central heating — temperature control system" }] },
              ],
            },
          ],
        },
        {
          type: "exercise" as const,
          id: "u2-vo-ex-1",
          exercise: {
            id: "u2-vo-ex-1",
            type: "gap_select" as const,
            label: "Vocabulary Exercise 1",
            description: "Match housing types to descriptions.",
            questions: [
              {
                id: "u2-vo-ex-1-q1",
                prompt: "A ___ is a small house in a rural area.",
                options: ["villa", "cottage", "apartment", "studio"],
                correctIndex: 1,
              },
              {
                id: "u2-vo-ex-1-q2",
                prompt: "An ___ is a unit in a multi-story building.",
                options: ["house", "apartment", "villa", "garage"],
                correctIndex: 1,
              },
            ],
          },
        },
      ],
    },

    // =========================================================================
    // SECTION 3 — Listening: Housing Conversations
    // =========================================================================
    {
      id: "u2-s-listening",
      skill: "listening",
      title: "Listening — Housing & Rental Inquiries",
      awardsProgress: true,
      blocks: [
        {
          type: "theory" as const,
          id: "u2-li-theory-1",
          heading: "Listening Tips",
          body: [
            {
              type: "list" as const,
              ordered: true,
              items: [
                { type: "list_item" as const, children: [{ text: "Listen for key details: price, size, location, amenities" }] },
                { type: "list_item" as const, children: [{ text: "Note comparative language (bigger, better, more expensive)" }] },
                { type: "list_item" as const, children: [{ text: "Pay attention to questions about availability and terms" }] },
              ],
            },
          ],
        },
        {
          type: "exercise" as const,
          id: "u2-li-ex-1",
          exercise: {
            id: "u2-li-ex-1",
            type: "multiple_choice" as const,
            label: "Listening Exercise 1",
            description: "Listen to a property inquiry conversation and answer questions.",
            questions: [
              {
                id: "u2-li-ex-1-q1",
                prompt: "What type of property is the person looking for?",
                options: ["A studio", "A two-bedroom apartment", "A house", "A villa"],
                correctIndex: 1,
              },
              {
                id: "u2-li-ex-1-q2",
                prompt: "What is the maximum rent the person can afford?",
                options: ["€500", "€800", "€1200", "€1500"],
                correctIndex: 2,
              },
            ],
          },
        },
      ],
    },

    // =========================================================================
    // SECTION 4 — Speaking: Describing Properties
    // =========================================================================
    {
      id: "u2-s-speaking",
      skill: "speaking",
      title: "Speaking — Describing Accommodation",
      awardsProgress: true,
      blocks: [
        {
          type: "theory" as const,
          id: "u2-sp-theory-1",
          heading: "Useful Phrases for Describing Homes",
          body: [
            {
              type: "list" as const,
              ordered: false,
              items: [
                { type: "list_item" as const, children: [{ text: "It has a spacious living room..." }] },
                { type: "list_item" as const, children: [{ text: "The kitchen is equipped with..." }] },
                { type: "list_item" as const, children: [{ text: "There are three bedrooms and..." }] },
                { type: "list_item" as const, children: [{ text: "The property features a garden with..." }] },
                { type: "list_item" as const, children: [{ text: "It's located near schools and shops..." }] },
              ],
            },
          ],
        },
        {
          type: "exercise" as const,
          id: "u2-sp-ex-1",
          exercise: {
            id: "u2-sp-ex-1",
            type: "speaking_open" as const,
            label: "Speaking Exercise 1",
            description: "Describe your ideal home in 60-90 seconds.",
            recordingTimeSec: 90,
            questions: [
              {
                id: "u2-sp-ex-1-q1",
                prompt: "Describe your ideal home. What type of accommodation is it? What features does it have? Where is it located?",
              },
            ],
          },
        },
      ],
    },

    // =========================================================================
    // SECTION 5 — Reading: Housing Articles
    // =========================================================================
    {
      id: "u2-s-reading",
      skill: "reading",
      title: "Reading — Housing Trends & Property Information",
      awardsProgress: true,
      blocks: [
        {
          type: "theory" as const,
          id: "u2-re-theory-1",
          heading: "Reading Strategy: Skimming for Information",
          body: [
            {
              type: "paragraph" as const,
              children: [
                { text: "When reading property descriptions or housing articles, " },
                { text: "skim", bold: true },
                { text: " the text first to identify main topics, then read carefully for specific details like price, location, and amenities." },
              ],
            },
          ],
        },
        {
          type: "exercise" as const,
          id: "u2-re-ex-1",
          exercise: {
            id: "u2-re-ex-1",
            type: "true_false" as const,
            label: "Reading Exercise 1",
            description: "Read a property listing and answer true/false questions.",
            questions: [
              {
                id: "u2-re-ex-1-q1",
                prompt: "The apartment has a balcony.",
                correctIndex: 0, // true
              },
              {
                id: "u2-re-ex-1-q2",
                prompt: "There is a parking space included.",
                correctIndex: 1, // false
              },
            ],
          },
        },
      ],
    },

    // =========================================================================
    // SECTION 6 — Writing: Accommodation Descriptions & Inquiries
    // =========================================================================
    {
      id: "u2-s-writing",
      skill: "writing",
      title: "Writing — Describing Properties & Making Inquiries",
      awardsProgress: true,
      blocks: [
        {
          type: "theory" as const,
          id: "u2-wr-theory-1",
          heading: "Writing about Property Features",
          body: [
            {
              type: "list" as const,
              ordered: true,
              items: [
                { type: "list_item" as const, children: [{ text: "Start with location and type of property" }] },
                { type: "list_item" as const, children: [{ text: "Describe rooms and main features" }] },
                { type: "list_item" as const, children: [{ text: "Mention amenities and advantages" }] },
                { type: "list_item" as const, children: [{ text: "Add information about price or availability" }] },
              ],
            },
          ],
        },
        {
          type: "exercise" as const,
          id: "u2-wr-ex-1",
          exercise: {
            id: "u2-wr-ex-1",
            type: "writing_form" as const,
            label: "Writing Exercise 1",
            description: "Write a short description of a property you would like to rent.",
            questions: [
              {
                id: "u2-wr-ex-1-q1",
                prompt: "Describe your ideal rental property (80-120 words)",
              },
            ],
          },
        },
      ],
    },
  ],
};

export default unit2;
