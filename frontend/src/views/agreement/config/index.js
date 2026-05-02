import { APTIS, IELTS } from 'constant/models'
import PLANS from 'utils/plans'

/**
 * @description
 * Module for avoiding re-renders with static variables readonlys.
 */

const config = {
  attributes: ['classes', 'speaking', 'writing'],
  allowed: [
    PLANS.BLUE,
    PLANS.GREEN,
    PLANS.DIAMOND,
    PLANS.MASTER,
    PLANS.GRANDMASTER
  ],
  confirmationHourBeforeClassStart: 4,
  counter: {
    max: 1,
    min: 0
  },
  httpClient: {
    languages: {
      endpoint: '/api/v1/languages',
      method: 'GET',
      requiresAuth: true
    },
    users: {
      endpoint: '/api/v1/users?role=teacher&page=1&search=',
      method: 'GET',
      requiresAuth: true
    },
    date: {
      endpoint: '/system',
      method: 'GET'
    }
  },
  languagePicker: [
    'Si escoges - Español, el profesor podrá darte la clase en español e inglés.',
    'Si escoges - Inglés, el profesor solo hablará inglés'
  ],
  levels: {
    [APTIS]: ['A2', 'B1', 'B2', 'C1'],
    [IELTS]: [
      "I don't know",
      'Elementary: A2 – Band 4',
      'Intermediate: B1 – Bands 4.5 to 5.5',
      'Upper intermediate: B2 – Bands 5.5 to 6.5',
      'Advance: C1 – Bands 7 to 8.5',
    ]
  },
  about: {
    [APTIS]:  [
      'Inglés general',
      'Preparación Writing',
      'Grammar & Vocabulary',
      'Preparación de Speaking',
      'Reading'
    ],
    [IELTS]: [
      "General English",
      "Writing Skills",
      "Grammar and Vocabulary",
      "Speaking exam practice",
      "Reading"
    ]
  }
}

export default config
