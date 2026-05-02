import * as auth from './auth'
import * as classes from './classes'
import * as categories from './categories'
import * as courses from './courses'
import * as evaluations from './evaluations'
import * as exams from './exams'
import * as feedback from './feedback'
import * as models from './models'
import * as languages from './languages'
import * as plans from './plans'
import * as packages from './packages'
import * as subscriptions from './subscriptions'
import * as roles from './roles'
import * as schedules from './schedules'
import * as stats from './stats'
import * as users from './users'
import * as settings from './settings'
import * as notifications from './notifications'

/**
 * @description
 * API interface.
 */
const api = {
  auth,
  categories,
  classes,
  courses,
  evaluations,
  exams,
  feedback,
  models,
  languages,
  packages,
  plans,
  subscriptions,
  roles,
  settings,
  schedules,
  stats,
  users,
  notifications
}

export default api
