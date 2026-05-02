/**
 * @typedef {Object} HttpRequest
 * @property {string} message API Rest details.
 * @property {{}} response API Response.
 * @property {number} statusCode API client statusCode.
 */

/**
 * @typedef {Object} Dispatch
 * @property {string} type
 * @property {any} payload
 */

/**
 * @typedef {Object<string, number>} HttpState
 * @property {string} message
 * @property {number} statusCode
 */

/**
 * @typedef {Object} PaymentState
 * @property {boolean | null} payment
 * @property {string | null} error
 * @property {string} giftEmail
 */

/**
 * @typedef {Object} RootState
 * @property {import ('store/reducers/authentication').AuthState} AuthState
 */

/**
 * @typedef {Object} Plan
 * @property {string} currency
 * @property {number} id
 * @property {string} name
 * @property {number} price
 * @property {string} createdAt
 */

/**
 * @typedef {Object} StripePayment
 * @property {number} planId
 * @property {string} token
 * @property {number} userId
 */

/**
 * @typedef {Object} Question
 * @property {number} id
 * @property {string} title
 * @property {number} orderAs
 * @property {string} imageUrl
 * @property {number} exerciseId
 * @property {number} strictOrder
 */

/**
 * @typedef {Object} AnswerParam
 * @property {number} id
 * @property {string} title
 * @property {boolean} isCorrect
 * @property {number} questionId
 */

/**
 * @typedef {Object} Course
 * @property {number} recordingTime
 * @property {Question []} questions
 * @property {string} description
 * @property {string} title
 * @property {AnswerParam []} answers
 * @property {correct} number
 */

/**
 * @typedef {Object} Quote
 * @property {string} quote
 * @property {string} author
 * @property {string} src
 */

/**
 * @typedef {'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'small' | 'span'} TextTag
 */

/**
 * @typedef {'muted' | 'orange' | 'gray' | 'black' | 'danger' | 'success' | 'info' | 'warning' | 'secondary' | 'primary'} TextColor
 */

/**
 * @typedef {Object} GiftState
 * @property {string} email
 * @property {boolean} exchanged
 * @property {boolean} success
 */

/**
 * @typedef {Object} ReportOptions
 * @property {string} message
 * @property {string} context
 */

/**
 * @typedef {Object} Exercise
 * @property {string []} answers
 * @property {string []} questions
 * @property {string} description
 * @property {string} title
 * @property {string} recordingUrl
 * @property {number} correct
 * @property {string} label
 */

/**
 * @typedef {Object} Question
 * @property {string} title
 * @property {string []} answers
 * @property {number} correct
 */

/**
 * @typedef {() => Promise<void>} Thunk
 */

/**
 * @typedef {Object} Package
 * @property {number} total
 * @property {boolean} isActive
 * @property {Date} expirationDate
 * @property {number} classes
 * @property {number} speakings
 * @property {number} writings
 * @property {boolean} isNotified
 * @property {number} id
 * @property {Plan} plan
 */

/**
 * @typedef {Object} Role
 * @property {string} name
 */

/**
 * @typedef {Object} User
 * @property {string} firstName
 * @property {string} lastName
 * @property {string} token
 * @property {string} email
 * @property {string | null} imageUrl
 * @property {string} lang
 * @property {Role} role
 * @property {number} id
 * @property {boolean} isVerified
 */

/**
 * @typedef {Object} Model
 * @property {string} name
 * @property {number} id
 * @property {Date} createdAt
 * @property {Date} updatedAt
 */

/**
 * @typedef {Object} Exam
 * @property {string} url
 * @property {number} id
 * @property {string} name
 * @property {boolean} requiresPayment
 * @property {Date} createdAt
 * @property {Date} updatedAt
 */

/**
 * @typedef {Object} Progress
 * @property {number} id
 * @property {JSON} data
 */

/**
 * @typedef {Object} AbortableRequest
 * @property {AbortSignal} signal
 * @property {number?} id
 */

/**
 * @typedef {Object} LatestEvaluation
 * @property {JSON} data
 * @property {id} number
 * @property {Category} category
 * @property {Date} createdAt
 * @property {Date} updatedAt
 */

/**
 * @typedef {Object} Category
 * @property {string} name
 * @property {number} id
 * @property {Date} createdAt
 * @property {Date} updatedAt
 */

/**
 * @typedef {Object} useBackendService
 * @property {boolean} preload fetch on the first render the component is mounted.
 */

/**
 * @typedef {Object} ModuleService
 * @property {'Dropdown' | 'Matching'} module
 * @property {Question []} questions
 */


/**
 * @typedef {Object} Evaluation
 * @property {number} id
 * @property {Date} createdAt
 * @property {Date} updatedAt
 */

/**
 * @typedef {Object} Commit
 * @property {number} langId
 * @property {number} userId
 * @property {Date} startDate
 * @property {Date} endDate
 * @property {number} id
 * @property {number} modelId
 * @property {number} deleted
 */


/**
 * @typedef {Object} Language
 * @property {string} lang
 * @property {number} id
 * @property {Date} createdAt
 * @property {Date} updatedAt
 */


/**
 * @typedef {Object} CommonFetchRequest
 * @property {AbortSignal} signal
 * @property {number} page
 * @property {number} id 
 */