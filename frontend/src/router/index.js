import Exams from 'views/exams'
import SignUp from 'views/authentication/SignUp'
import Dashboard from 'views/dashboard/Dashboard'
import Login from 'views/authentication/Login'
import ResetPassword from 'views/authentication/ResetPassword'
import Plans from 'views/plans'
import Models from 'views/models'
import Unit1View from 'views/courses/Unit1View'
import ConnectedUnitView from 'views/courses/ConnectedUnitView'
import CoursesOverview from 'views/courses/CoursesOverview'
import Settings from 'views/settings/Settings'
import GrammarView from 'views/grammar'
import VocabularyView from 'views/vocabulary'
import ListeningView from 'views/listening'
import ReadingView from 'views/reading'
import ReadingBView from 'views/reading-b'
import ReadingCView from 'views/reading-c'
import SpeakingView from 'views/speaking'
import SpeakingCView from 'views/speaking-c'
import WritingView from 'views/writing'

import PATH from 'utils/path'
const defaultRouterConfig = {
  disableNavigationTour: false,
  injectModelsBeforeRender: false,
  exact: true
}

/**
 * @typedef {Object} RouteParameters
 * @property {import ('react').Component} component
 * @property {string} path
 * @property {boolean} exact
 */

/**
 * @type {{ routes: { public: Array<RouteParameters>, private: Array<RouteParameters> }}}
 */
export const router = {
  routes: {
    public: [
      {
        component: Login,
        path: '/',
        ...defaultRouterConfig
      },
      {
        component: SignUp,
        path: PATH.SIGN_UP,
        ...defaultRouterConfig
      },
      {
        component: ResetPassword,
        path: '/reset-password',
        ...defaultRouterConfig
      },
      {
        component: Exams,
        path: PATH.EXAMS,
        ...defaultRouterConfig
      },
      {
        component: Dashboard,
        path: '/dashboard',
        ...defaultRouterConfig
      },
      {
        component: GrammarView,
        path: PATH.GRAMMAR,
        ...defaultRouterConfig
      },
      {
        component: VocabularyView,
        path: PATH.VOCABULARY,
        ...defaultRouterConfig
      },
      {
        component: ListeningView,
        path: PATH.LISTENING,
        ...defaultRouterConfig
      },
      {
        component: ReadingView,
        path: PATH.READING,
        ...defaultRouterConfig
      },
      {
        component: ReadingBView,
        path: PATH.READING_B,
        ...defaultRouterConfig
      },
      {
        component: ReadingCView,
        path: PATH.READING_C,
        ...defaultRouterConfig
      },
      {
        component: SpeakingView,
        path: PATH.SPEAKING,
        ...defaultRouterConfig
      },
      {
        component: WritingView,
        path: PATH.WRITING,
        ...defaultRouterConfig
      },
      {
        component: SpeakingCView,
        path: PATH.SPEAKING_C,
        ...defaultRouterConfig
      },
      {
        component: Unit1View,
        path: PATH.UNIT_1,
        ...defaultRouterConfig
      },
      {
        component: CoursesOverview,
        path: PATH.COURSES,
        ...defaultRouterConfig
      },
      {
        component: ConnectedUnitView,
        path: PATH.CONNECTED_UNIT,
        ...defaultRouterConfig
      },
      {
        component: Plans,
        path: '/plans',
        ...defaultRouterConfig
      },
      {
        component: Models,
        path: '/models',
        ...defaultRouterConfig
      },
      {
        component: Settings,
        path: '/settings',
        ...defaultRouterConfig
      }
    ],
    private: [],
    development: []
  }
}
