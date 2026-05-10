import { agreementES } from 'lang/data/agreement/es'
import { allES } from 'lang/data/all/es'
import { authenticationES } from 'lang/data/authentication/es'
import { classesES } from 'lang/data/classes/es'
import { componentsES } from 'lang/data/components/es'
import { coursesES } from 'lang/data/courses/es'
import { dashboardES } from 'lang/data/dashboard/es'
import { defaultES } from 'lang/data/default/es'
import { errorsES } from 'lang/data/errors/es'
import { evaluationsES } from 'lang/data/evaluations/es'
import { examsES } from 'lang/data/exams/es'
import { exchangeES } from 'lang/data/exchange/es'
import { feedbackES } from 'lang/data/feedback/es'
import { forgotPasswordES } from 'lang/data/forgot-password/es'
import { loadingIndicatorES } from 'lang/data/loadingIndicator/es'
import { mailsES } from 'lang/data/mails/es'
import { meetingsES } from 'lang/data/meetings/es'
import { modalES } from 'lang/data/modal/es'
import { modelsES } from 'lang/data/models/es'
import { navigationES } from 'lang/data/navigation/es'
import { notificationsES } from 'lang/data/notifications/es'
import { plansES } from 'lang/data/plans/es'
import { qualityES } from 'lang/data/quality/es'
import { reportES } from 'lang/data/report/es'
import { resetPasswordES } from 'lang/data/resetPassword/es'
import { settingsES } from 'lang/data/settings/es'
import { signUpES } from 'lang/data/signUp/es'
import { statsES } from 'lang/data/stats/es'
import { termsES } from 'lang/data/terms/es'
import { textES } from 'lang/data/text/es'
import { toastNotificationES } from 'lang/data/toastNotification/es'
import { tourES } from 'lang/data/tour/es'
import { demoES } from 'lang/data/demo/es'


/**
 * @description
 * Modularization fallback for language support.
 * Each member of "es" in uppercase means a view support only, these members
 * Only belongs to the view assigned.
 * @member "AUTHENTICATION" supports text for authentication.
 * @member "TOAST_NOTIFICATION" supports text for toasts notifications.
 * */

const es = {
  AGREEMENT: agreementES,
  ALL: allES,
  AUTHENTICATION: authenticationES,
  CLASSES: classesES,
  COMPONENTS: componentsES,
  COURSES: coursesES,
  DASHBOARD: dashboardES,
  EVALUATIONS: evaluationsES,
  ERRORS: errorsES,
  DEFAULT: defaultES,
  EXAMS: examsES,
  EXCHANGE: exchangeES,
  FEEDBACK: feedbackES,
  FORGOT: forgotPasswordES,
  LOADING_INDICATOR: loadingIndicatorES,
  MAILS: mailsES,
  MEETING: meetingsES,
  MODAL: modalES,
  MODELS: modelsES,
  NAVIGATION: navigationES,
  NOTIFICATIONS: notificationsES,
  PLANS: plansES,
  QUALITY: qualityES,
  REPORT: reportES,
  RESET_PASSWORD: resetPasswordES,
  SETTINGS: settingsES,
  SIGN_UP: signUpES,
  TEXT: textES,
  TOAST_NOTIFICATION: toastNotificationES,
  TOUR: tourES,
  STATS: statsES,
  TERMS: termsES,
  WELCOME: demoES.WELCOME,
  DEMO: demoES.DEMO,
  UNLOCK: demoES.UNLOCK,
  BANNER: demoES.BANNER,
  PAYMENT: { ...demoES.PAYMENT }
}

export default es
