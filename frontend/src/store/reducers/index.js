import { combineReducers } from '@reduxjs/toolkit'

/** @reducers */
import errorReducer from './errors'
import httpReducer from './http'
import sessionReducer from './session'

import auth from 'store/@reducers/auth'
import categories from 'store/@reducers/categories'
import classes from 'store/@reducers/classes'
import courses from 'store/@reducers/courses'
import evaluations from 'store/@reducers/evaluations'
import exams from 'store/@reducers/exams'
import feedback from 'store/@reducers/feedback'
import languages from 'store/@reducers/languages'
import models from 'store/@reducers/models'
import notifications from 'store/@reducers/notifications'
import packages from 'store/@reducers/packages'
import plans from 'store/@reducers/plans'
import subscriptions from 'store/@reducers/subscriptions'
import roles from 'store/@reducers/roles'
import settings from 'store/@reducers/settings'
import stats from 'store/@reducers/stats'
import users from 'store/@reducers/users'
import schedule from 'store/@reducers/schedules'

/** @see https://redux.js.org/api/combinereducers  */

const rootReducer = combineReducers({
  auth,
  categories,
  classes,
  courses,
  evaluations,
  errors: errorReducer,
  exams,
  feedback,
  http: httpReducer,
  languages,
  notifications,
  models,
  packages,
  plans,
  subscriptions,
  roles,
  settings,
  session: sessionReducer,
  stats,
  users,
  schedule
})

export default rootReducer
