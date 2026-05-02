/**
 * @module AuthReducer
 */

/**
 * @description
 * This event works with after a sucessfully authentication.
 * @memberof AuthReducer
 */
export const LOGIN = 'LOGIN'


/**
 * @description
 * This event works with logout.
 */
export const LOGOUT = 'LOGOUT'


export const DEMO_LOGIN = 'DEMO_LOGIN'

/**
 * @description
 * This event works after succesfull register action.
 * @memberof AuthReducer
 */
export const REGISTER = 'REGISTER'

/**
 * @description
 * Mantains the originally data being sync.
 * @memberof AuthReducer
 */
export const REFRESH_TOKEN = 'REFRESH_TOKEN'

/**
 * @description
 * This event works toggling the loading state for Auth Actions.
 * @memberof AuthReducer
 */
export const TOGGLE_LOADING = 'TOGGLE_LOADING'

/**
 * @description
 * When something has changed we want to check in our component updates.
 * We need to restore to commit has nothing change in the future.
 * @memberof AuthReducer
 */
export const ASYNC_ACTION_END = 'ASYNC_ACTION_END'

/**
 * @description
 * When the password changes with a sucessful response, we dispatch this event.
 * @memberof AuthReducer
 */
export const CHANGE_PASSWORD = 'CHANGE_PASSWORD'

/**
 * @description
 * After a sucessfull verification of email, we dispatch this event.
 * @memberof AuthReducer
 */
export const VERIFY_ACCOUNT = 'VERIFY_ACCOUNT'

/**
 * @description
 * If code verification fails, we dispatch this error.
 * @memberof AuthReducer
 */
export const VERIFY_ACCOUNT_LOADING = 'VERIFY_ACCOUNT_LOADING'


/**
 * @description
 * When fetch or httpService functions fail, we dispatch this event with the message to indicate what's fail.
 * Generally, this event is called in our App.js to track in all routes.
 * @memberof ErrorReducer
 */
export const SERVICE_ERROR = 'SERVICE_ERROR'

/**
 * @description
 * Clearing our SERVICE error makes easy and stop propagating the error.
 * @memberof ErrorReducer
 */
export const SERVICE_ERROR_CLEAR = 'SERVICE_ERROR_CLEAR'

/**
 * @description
 * Service error redirect indicates that after an error with need to redirect to some route.
 * @memberof ErrorReducer
 */
export const SERVICE_ERROR_REDIRECT = 'SERVICE_ERROR_REDIRECT'

/**
 * @description
 * Assigns a package/plan for an user/client.
 * @memberof AdminReducer
 */
export const ASSIGN_PACKAGE = 'ASSIGN_PACKAGE'

export const ASSIGN_PACKAGE_END = 'ASSIGN_PACKAGE_END'

/**
 * @description
 * This action allows to request to the server for users, with their data.
 * @memberof AdminReducer
 */
export const FETCH_USERS = 'FETCH_USERS'

/**
 * @description
 * This action allows to request to the server for teachers, with their data.
 * @memberof AdminReducer
 */
export const FETCH_TEACHERS = 'FETCH_TEACHERS'

/**
 * @description
 * When a async operation is running we need to check that the user state is loading.
 * @memberof AdminReducer
 */
export const TOGGLE_USER_LOADER = 'TOGGLE_USER_LOADER'

/**
 * @description
 * This action make a request to the API to delete an user.
 * @memberof AdminReducer
 */
export const DELETE_USER = 'DELETE_USER'

/**
 * @description
 * Toggles the loader from options dashboard.
 * @memberof AdminReducer
 */
export const CONTROLS = 'CONTROLS'


/**
 * @description
 * Request for submit a new User/Teacher.
 * @memberof AdminReducer
 */
export const CREATE_USER = 'CREATE_USER'

/**
 * @description
 * Ends the user creation.
 */
export const CREATE_USER_END = 'CREATE_USER_END'

/**
 * @description
 * Get all source data from roles.
 * Note this is one of the most important services of the App.
 * @memberof ResourceReducer
 */
export const FETCH_ROLES = 'FETCH_ROLES'

/**
 * @description
 * Start fetching roles.
 */
export const FETCH_ROLES_START = 'FETCH_ROLES_END'

/**
 * @description
 * Upload Files
 * @memberof ResourceReducer
 */
export const UPLOAD_FILES = 'UPLOAD_FILES'

/**
 * @description
 * Get the current pacakge what is current payed for the user.
 * @memberof PackageReducer
 */

export const CREATE_PACKAGE_START = 'CREATE_PACKAGE_START'

export const CREATE_PACKAGE_END = 'CREATE_PACKAGE_END'

export const DONE_PAYMENT = 'DONE_PAYMENT'

export const FETCH_PACKAGE = 'FETCH_PACKAGE'

export const FETCH_PACKAGES_START = 'FETCH_PACKAGES_START'

export const FETCH_PACKAGES_END = 'FETCH_PACKAGES_END'

/**
 * @description
 * Update the current package used and load a new progress.
 */
export const UPDATE_PACKAGE = 'UPDATE_PACKAGE'

/**
 * @description
 * If something goes wrong, we dispatch this action.
 * @memberof ResourceReducer
 */
export const FETCH_ROLES_ERROR = 'FETCH_ROLES_ERROR'

/**
 * @description
 * Clearing the error.
 * @memberof ResourceReducer
 */
export const FETCH_ROLES_ERROR_CLEAR = 'FETCH_ROLES_ERROR_CLEAR'

/**
 * @description
 * Sets the pagination of the current resources admin/users.
 * @memberof ResourceReducer
 */
export const FETCH_PAGINATION = 'FETCH_PAGINATION'

/**
 * @description
 * Fetch all exams data.
 * @memberof UserReducer
 */

export const FETCH_EXAMS = 'FETCH_EXAMS'

/**
 * @description
 * Fetchs all content of an examn.
 * @memberof UserReducer
 */
export const FETCH_EXAM = 'FETCH_EXAM'

/**
 * @description
 * Fetch an exercise.
 * @memberof UserReducer
 */

export const FETCH_EXERCISE = 'FETCH_EXERCISE'

/**
 * @description
 * Fetch a retrieve of questions.
 * @memberof UserReducer
 */

export const FETCH_QUESTIONS = 'FETCH_QUESTIONS'

/**
 * @description
 * Fetch the retrvie plans.
 * @memberof UserReducer
 */
export const FETCH_PLANS_END_REQUEST = 'FETCH_PLANS_END_REQUEST'

export const FETCH_PLANS_START_REQUEST = 'FETCH_PLANS_START_REQUEST'

/**
 * @description
 * Fetch all data from questions and persist to move on the next
 * Question.
 * @memberof UserReducer
 */
export const FETCH_QUESTIONS_PERSIST = 'FETCH_QUESTIONS_PERSIST'

/**
 * @description
 * Get one question and his parent data.
 * @memberof UserReducer
 */
export const FETCH_QUESTION = 'FETCH_QUESTION'

/**
 * @description
 * Select an answer a set it into the store.
 * @memberof UserReducer
 */
export const SELECT_ANSWER = 'SELECT_ANSWER'

/**
 * @description
 * Select selection from a answer selection.
 */
export const SET_SELECTION = 'SET_SELECTION'

/**
 * @description
 * Gets the current progress, if the progress doesn't exist.
 * We created one through the endpoint.
 * @memberof UserReducer
 */
export const FETCH_PROGRESS = 'FETCH_PROGRESS'

/**
 * @description
 * Creates a current progress.
 * @memberof UserReducer
 */
export const CREATE_PROGRESS = 'CREATE_PROGRESS'

/**
 * Restarts the progress of an competence.
 * @description
 */

export const RESTART_PROGRESS = 'RESTART_PROGRESS'

/**
 *
 * @description
 */
export const OVERRIDE_PROGRESS = 'OVERRIDE_PROGRESS'

export const RESTART_PROGRESS_AND_GO_TO_DASHBOARD =
  'RESTART_PROGRESS_AND_GO_TO_DASHBOARD'

/**
 * @description
 * Get the current feedback of the user.
 * @memberof UserReducer
 */
export const FETCH_FEEDBACK = 'FETCH_FEEDBACK'

export const START_REQUEST_FEEDBACK = 'START_REQUEST_FEEDBACK'

/**
 * @description
 * Selecting a meaning in vocabulary will set the value.
 * @memberof ExamReducer.
 */

export const SET_ANSWER = 'SET_ANSWER'

/**
 * @description
 * Selecting a a value from reading.
 * @memberof ExamReducer
 */
export const SET_QUESTION = 'SET_QUESTION'

/**
 * @description
 * Sets an specific exercise.
 * @memberof ExamReducer
 */
export const SET_EXERCISE_TYPE = 'SET_EXERCISE_TYPE'

/**
 * @description
 * Set a blob file with the content binary data.
 * @memberof ExamReducer
 */
export const SET_RECORDING = 'SET_RECORDING'

/**
 * @description
 * Get the next question.
 * @memberof ExamReducer
 */

export const NEXT_EXERCISE = 'NEXT_EXERCISE'

/**
 * @description
 * Check if a payment error has ocurred.
 * @memberof PaymentReducer
 */
export const PAYMENT_ERROR = 'PAYMENT_ERROR'

/**
 * @description
 * Check it a paymnet has sucessfully ocurred.
 * @memberof PaymentReducer
 */
export const PAYMENT_SUCCESS = 'PAYMENT_SUCCESS'

/**
 * @description
 * Calls an httpError.
 * @memberof HttpReducer
 */
export const HTTP_ERROR = 'HTTP_ERROR'

/**
 * @description
 * Deletes the current httpError.
 * @memberof httpError
 */
export const REMOVE_HTTP_ERROR = 'REMOVE_HTTP_ERROR'

/**
 * @description
 * Fetchs an evaluation
 * @memberof TeacherReducer
 */
export const FETCH_EVALUATION = 'FETCH_EVALUATION'


export const FETCH_EVALUATION_REQUEST = 'FETCH_EVALUATION_REQUEST'

/**
 * @description
 * Fetchs all evaluations pending.
 * @memberof TeacherReducer
 */
export const FETCH_EVALUATIONS = 'FETCH_EVALUATIONS'


export const UPDATE_EVALUATION_REQUEST = 'UPDATE_EVALUATION_REQUEST'
/**
 * @description
 * Updates evaluation status.
 * @memberof TeacherReducer
 */
export const UPDATE_EVALUATION= 'UPDATE_EVALUATION'

/**
 * @description
 * Fetch all own evaluations from a teacher.
 * @memberof TeacherReducer
 */
export const FETCH_OWN_EVALUATIONS = 'FETCH_OWN_EVALUATIONS'

/**
 * @description
 * Delete a evaluation from "my evaluations"
 * @memberof TeacherReducer
 */
export const DELETE_OWN_EVALUATION = 'DELETE_OWN_EVALUATION'

/**
 * @description
 * Submits the results for the users and notifies via email.
 * @memberof
 */
export const CREATE_RESULTS = 'CREATE_RESULTS'

/**
 * @description
 * Fetch all results from an user.
 * @memberof UserReducer
 */
export const FETCH_RESULTS = 'FETCH_RESULTS'


/**
 * @description
 * Starts request from fetching results.
 */
export const FETCH_RESULTS_REQUEST = 'FETCH_RESULTS_REQUEST'

/**
 * @description
 * Fetch one result from an user.
 * @memberof UserReducer
 */
export const FETCH_RESULT = 'FETCH_RESULT'

/**
 * @description
 * Get all information about statistics
 */
export const FETCH_STATS = 'FETCH_STATS'

/**
 * @description
 * Get all information about specific statistics.
 */
export const FETCH_STATS_CATEGORY = 'FETCH_STATS_PER_CATEGORY'

/**
 * @description
 * @memberof ResourceReducer
 * Get all information about count of speakigns/writings.
 */
export const FETCH_COUNT_EVALUATION = 'FETCH_COUNT_EVALUATION'

/**
 * @description
 * Changes the email of the gift that will be sended.
 */

/**
 * @description
 * Like on {React.onChangeEvent<HTMLInputElement>}
 * @memberof giftReducer
 */
export const CHANGE_GIFT_EMAIL = 'CHANGE_GIFT_EMAIL'

/**
 * @description
 * Pays for a gift friend.
 * @memberof giftReducer
 */
export const PAYMENT_GIFT = 'PAYMENT_GIFT'

/**
 * @description
 * Exchange a serial for a gift.
 * @memberof giftReducer
 */
export const EXCHANGE_GIFT = 'EXCHANGE_GIFT'

/**
 * @description
 * Upploads a course.
 * @memberof AdminReducer
 */
export const UPLOAD_COURSE = 'UPLOAD_COURSE'

/**
 * @description
 * Updates user's current course.
 * @memberof CourseReducer
 */
export const UPDATE_COURSE = 'UPDATE_CORUSE'

/**
 * @description
 * Get the user's current advance.
 */
export const GET_COURSE_ADVANCE = 'GET_COURSE_ADVANCE'

/**
 * @description
 * Sends a report.
 * @memberof ResourceReducer
 */
export const START_REPORT_REQUEST = 'START_REPORT_REQUEST'

/**
 * @description
 * When reports end.
 * @memberof ResourceReducer
 */
export const START_REPORT_END = 'START_REPORT_END'

/**
 * @description
 * @memberof UserReducer
 * Updating progress request.
 */
export const START_UPDATING_PROGRESS = 'START_UPDATING_PROGRESS'

/**
 * @description
 * @memberof UserReducer
 * Updating progress request when ends.
 */
export const END_UPDATING_PROGRESS = 'END_UPDATING_PROGRESS'

/**
 * @description
 * @memberof UserReducer
 * Unmounting the process to make available to select exercises again.
 */
export const UNMOUNT_EXAM_PROCESS = 'UNMOUNT_EXAM_PROCESS'

/**
 * @description
 * @memberof UserReducer
 * Getting feedback from update.
 */
export const GET_FEEDBACK_FROM_UPDATE = 'GET_FEEDBACK_UPDATE'

/**
 * @description
 * When admin selects "create video call" this event is fired.
 */
export const CREATE_STAGED_CLASS = 'CREATE_STAGGED_CLASS'

/**
 * @description
 * Set a new appointment.
 */
export const ADD_APPOINTMENT_CHANGE = 'ADD_APPOINTMENT_CHANGE'

/**
 * @description
 * Update End.
 */
export const UPDATE_END = 'UPDATE_END'

/**
 * @description
 * Request to create an schedule.
 */
export const CREATE_SCHEDULE = 'CREATE_SCHEDULE'

/**
 * @description
 * Ends the request of the schedule creation.
 */
export const CREATE_SCHEDULE_END = 'CREATE_SCHEDULE_END'

/**
 * @description
 * Schedule to be commited as completed.
 */
export const COMMITING_SCHEDULE = 'COMMITING_SCHEDULE'

/**
 * @description
 * Fetch all schedules request.
 */
export const FETCH_SCHEDULE_START_REQUEST = 'FETCH_SCHEDULE_START_REQUEST'

/**
 * @description
 * Stops cylce of request from schedule.
 */
export const FETCH_SCHEDULE_END_REQUEST = 'FETCH_SCHEDULE_END_REQUEST'

/**
 * @description
 * Starst to request a schedule deletion.
 */
export const DELETE_SCHEDULE_START_REQUEST = 'DETELE_SCHEDULE_START_REQUEST'

/**
 * @desciription
 * End the request and delete the schedule.
 */
export const DELETE_SCHEDULE_END_REQUEST = 'DELETE_SCHEDULE_END_REQUEST'

/**
 * @description
 * Create a classRoom.
 */
export const CREATE_CLASS_ROOM_START = 'CREATE_CLASS_ROOM_START'

/**
 * @description
 * Ends the creation.
 */
export const CREATE_CLASS_ROOM_END = 'CREATE_CLASS_ROOM_END'

/**
 * @description
 * Starts notify with ToastStore.
 */
export const NOTIFIY_REQUEST = 'NOTIFY_REQUEST'

/**
 * @description
 * Stops notifying.
 */
export const NOTIFY_END_REQUEST = 'NOTIFY_END_REQUEST'


/**
 * @description
 * This event works for meetings reducer.
 * And is the most important, he's able to connect all room in realtime.
 */
export const OPEN_LIVE_STREAM = 'OPEN_LIVE_STREAM'


/**
 * @description
 * Fetch one class room.
 * @memberof ClassReducer
 */
export const FETCH_CLASS_ROOM_START = 'FETCH_CLASS_ROOM_START'

/**
 * @description
 * Fetch one class room and ends the request.
 * @memberof ClassReducer
 * */ 
export const FETCH_CLASS_ROOM_END = 'FETCH_CLASS_ROOM_END'


/**
 * @description
 * Checks with interval the classRom instance.
 */
export const CHECK_CLASSROOM_TIMER = 'CHECK_CLASSROOM_TIMER'


/**
 * @description
 * Fetch all confirmed classes from a user.
 * @memberof ClassReducer
 */
export const FETCH_CLASS_ROOMS_START = 'FETCH_CLASS_ROOMS_START'

/**
 * @description
 * Fetch all confirmed classes from a user.
 * @memberof ClassReducer
 */
export const FETCH_CLASS_ROOMS_END = 'FETCH_CLASS_ROOMS_END'

/**
 * @description
 * Starts to fetching all courses.
 * @memberof CoursesReducer
 */
export const FETCH_COURSES_START_REQUEST = 'FETCH_COURSES_START_REQUEST'

/**
 * @description
 * Stop fetching all courses, and serves it.
 * @memberof CoursesReducer
 */
export const FETCH_COURSES_END_REQUEST = 'FETCH_COURSES_END_REQUEST'


/**
 * @description
 * Starts fetching a resource from cloudfront.
 * @memberof CoursesReducer
 */
export const FETCH_CLOUDFRONT_RESOURCE_START_REQUEST = 'FETCH_CLOUDFRONT_RESOURCE_START_REQUEST'


/**
 * @description
 * Ends fetching a resource from cloudfront.
 * @memberof CoursesReducer
 */
export const FETCH_CLOUDFRONT_RESOURCE_END_REQUEST = 'FETCH_CLOUDFRONT_END_REQUEST'


/**
 * @description
 * Starts to request a inscription.
 * @memberof CoursesReducer
 */
export const INSCRIPTION_START_REQUEST = 'INSCRIPTION_START_REQUEST'


/**
 * @description
 * End request for the inscription.
 */
export const INSCRIPTION_END_REQUEST = 'INSCRIPTION_END_REQUEST'


/**
 * @description
 * Starts requesting a fetch course advance.
 */
export const FETCH_COURSE_ADVANCE_START_REQUEST = 'FETCH_COURSE_ADVANCE_START_REQUEST'


/**
 * @description
 * End requesting a fetch course advance.
 */
export const FETCH_COURSE_ADVANCE_END_REQUEST = 'FETCH_COURSE_ADVAVANCE_REQUEST'


/**
 * @description
 * Updates the current advance.
 */
export const UPDATE_ADVANCE = 'UPDATE_ADVANCE'


/**
 * @description
 * Starts fetching evaluation request.
 */
export const FETCH_ALL_EVALUATIONS_REQUEST = 'FETCH_ALL_EVALUATIONS_REQUEST'


/**
 * @description
 * Clean all schedules on leave the view.
 */
export const CLEAN_SCHEDULES = 'CLEAN_SCHEDULES'



export const GIFT_START_REQUEST = 'GIFT_START_REQUEST'

/**
 * @description
 * Selects the tour for users.
 */
export const SELECT_NAVIGATION_TOUR = 'SELECT_NAVIGATION_TOUR'

/**
 * @description
 * Fetch models request.
 */
export const FETCH_MODELS_REQUEST = 'FETCH_MODELS_REQUEST'

/**
 * @description
 * Success on data.
 */
export const FETCH_MODELS_SUCCESS = 'FETCH_MODELS_SUCCESS'

/**
 * @description
 * Error on fetch data.
 */
export const FETCH_MODELS_ERROR = 'FETCH_MODELS_ERROR'


/**
 * @description
 * Selects the current context of the app.
 */
export const SELECT_MODEL = 'SELECT_MODEL'