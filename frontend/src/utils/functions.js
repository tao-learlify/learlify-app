import { ModuleRegExp } from 'common/module.regexp'
import PLANS from './plans'

/**
 * Formats a string to a unit time.
 * @param {string} value
 * @param {number} size
 * @returns {string}
 */
export function formatUnitTime(value, size) {
  const transform = `0000${value.toString()}`
  return transform.substr(transform.length - size)
}

/**
 * @description
 * Returns person fullName.
 * @param {string} firstName
 * @param {string} lastName
 * @returns {string}
 */
export function getFullName(firstName, lastName, split) {
  if (!firstName && !lastName) {
    return 'Sin nombre'
  }

  if (split) {
    return `${firstName.split(' ')[0]} ${lastName.split(' ')[0]}`
  }

  return `${firstName} ${lastName}`.trim()
}

/**
 * Returns a bearer token.
 * @param {string} token
 * @returns {string}
 */
export function bearerToken(token) {
  return `Bearer ${JSON.parse(token)}`
}

/**
 * @param {string []} formats
 * @returns {Function}
 */
export function allowedFormat(formats) {
  /**
   * @param {string} extName
   */
  return function (extName) {
    return formats
      .map(format => '.' + format.toLowerCase())
      .includes(getExtName(extName))
  }
}

/**
 * @description
 * Gets the extension of the filename.
 * @param {string} file
 * @returns {string}
 */
export function getExtName(file) {
  return file.substr(file.lastIndexOf('.'), file.length - 1)
}

/**
 * @requires Math.abs
 * @description
 * Pass a exact integer of seconds an transform to JavaScript Sec
 * @param {number} timer
 * @returns {number} duration
 */
export function getMaxDuration(timer) {
  if (!timer || typeof timer !== 'number') {
    return 0
  }
  return Math.abs(timer * 1000)
}


/**
 * @description
 * Check that an array is empty.
 * @param {[]} arr
 * @returns {boolean}
 */
export function isEmpty(arr) {
  if (arr) {
    return arr.length === 0
  }
  return true
}

/**
 * @description
 * Compares a value that indicates if it's null or not.
 * @param {any} value
 * @returns {boolean}
 */
export function isNull(value) {
  return value === null
}

/**
 * @descriptiony
 * Check if the value is emptyString, this will be more readable.
 * @param {string} value
 * @returns {boolean}
 */
export function isEmptyString(value) {
  return value === ''
}

/**
 * Extends an array with a new property.
 * @param {[]} arr
 * @param {string} value
 * @returns {[]}
 */
export function extended(arr, value = '') {
  return [value, ...arr]
}
/**
 * @description
 * Stripe chages aren't the normal price like 12$. Instead they make the price like 1200$.
 * @param {number} price
 */
export function getPackagePrice(price) {
  return price / 100
}

/**
 * @param {string} str
 */
export function getNumberOf(str) {
  return isNaN(parseInt(str[0] + str[1])) ? str[0] : parseInt(str[0] + str[1])
}

/**
 * @param {number} value
 */
export function timerOf(value) {
  let minutes = Math.floor(value / 60)

  let seconds = Math.floor(value % 60)

  if (seconds < 10) {
    seconds = `0${seconds}`
  }
  return `${minutes}:${seconds}`
}


/**
 * Sums an array of objects to a single value.
 * @param {[]} arr
 * @param {string} key
 * @param {number} initialValue
 */
export function sum(arr, key, initialValue) {
  return arr.reduce((previous, next) => previous + next[key], initialValue)
}

/**
 * @description
 * Returns a inline html string template of span.
 * @param {string} hex
 */
export function stylish(hex, defaultText = null) {
  return `<span style="color: ${hex}">${
    defaultText === null ? 'Inserta texto aquí' : defaultText
  }</span>`
}


export function between(x, y, target) {
  return target >= x && y <= target
}

/**
 *
 * @param {string} text
 * @param {number} from
 * @param {number} to
 * @param {string} middleOf
 * @returns {string}
 */
export function findAndReplace(text, from, to, middleOf) {
  return text.substring(0, from) + middleOf + text.substring(to)
}



/**
 *
 * @param {string} str
 */
export function capitalize(str) {
  return str.replace(str[0], str[0].toUpperCase())
}

/**
 * @param {string} text
 * @param {number} from
 * @param {number} length
 */
export function ellipsis(text, from, length) {
  if (text.length > length) {
    return text.substr(from, length).concat('...')
  }
  return text
}

/**
 * Only for valid packages that are active and not for the course.
 * @param {string} isActive
 * @param {string} name
 */
export function isValidPackage(isActive, name) {
  return (
    isActive &&
    [
      PLANS.GO,
      PLANS.MASTER,
      PLANS.DIAMOND,
      PLANS.RUBY,
      PLANS.SILVER,
      PLANS.GOLD,
      PLANS.PLATINUM,
      PLANS.GRANDMASTER
    ].includes(name)
  )
}

/**
 * Compare primitive values.
 * @param {any} value
 * @param {any} target
 * @returns {boolean}
 */
export function equal(value, target) {
  return value === target
}

/**
 * @param {[]} arr
 * @param {string []} properties
 */
export function fromArrayEntries(arr, properties) {
  if (typeof arr !== 'object' || typeof properties !== 'object') {
    return {}
  }
  return properties.reduce(
    (object, key, idx) => Object.assign(object, { [key]: arr[idx] }),
    {}
  )
}


export function getDeviceInfo() {
  if (window.navigator) {
    return {
      version: window.navigator.appVersion,
      agent: window.navigator.userAgent,
      product: window.navigator.productSub,
      platform: window.navigator.platform
    }
  }
}

/**
 * @typedef {Object} ReportContextSettings
 * @property {'exam'} feature
 * @property {{}} props
 */

/**
 * @param {ReportContextSettings} params
 */
export function createContextReport({ feature, props }) {
  if (feature === 'exam') {
    return `Se ha reportado un error en el ejercicio N. ${props.index} de tipo ${props.type} examen ${props.exam}`
  }
}

/**
 * @param {string} value
 * @returns {number}
 */
export function getLengthWithoutFalsyValues(value = '') {
  return value.split(' ').filter(Boolean).length
}

/**
 * @param {string} value
 * @returns {number}
 */
export function getHighNumberOf(value) {
  const matchPatternOf = value.match(ModuleRegExp.numbers)

  return Boolean(matchPatternOf) ? Math.max(...matchPatternOf) : 0
}

/**
 * Chain all content between array.
 * @param {[]} prevArray
 * @param {string} withKey
 * @returns {[]}
 */
export function chainArray(prevArray, withKey) {
  if (withKey) {
    return prevArray.reduce(
      (previous, next) => previous.concat(next[withKey]),
      []
    )
  }

  return prevArray.reduce((previous, next) => previous.concat(next), [])
}


/**
 * @param {string} max
 * @param {string} min
 */
export function over(max, min, override = true) {
  if (override) {
    return `${max + 1} / ${min}`
  }
  return `${max} / ${min}`
}

/**
 * @param {{}} value
 * @returns {boolean}
 */
export function removePredicateNullValues(value) {
  return value !== null
}

/**
 *
 * @param {File} file
 * @param {'readAsDataURL' | 'readAsArrayBuffer' | ''} method
 */
export function fileReader(file, method) {
  return new Promise((resolve, reject) => {
    try {
      const reader = new FileReader()

      reader.onload = function () {
        resolve(reader.result)
      }

      reader.onerror = reject

      reader[method](file)
    } catch (err) {
      return reject(err)
    }
  })
}

/**
 * @param {string} attach
 * @returns {Promise<Blob>}
 */
export function decodeToBlob(attach) {
  return new Promise((resolve, reject) => {
    try {
      const xhr = new XMLHttpRequest()

      xhr.open('GET', attach, true)

      xhr.responseType = 'blob'

      xhr.onload = function () {
        if (this.status === 200) {
          const response = this.response

          return resolve(response)
        }
      }

      xhr.onerror = reject
    } catch (err) {
      return reject(err)
    }
  })
}




/**
 * @param {string} message
 */
export function isHyperLink(message) {
  // eslint-disable-next-line no-useless-escape
  return /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi.test(
    message
  )
}

/**
 * @param {{ kind: 'string '}} device
 */
export function audioDevice(device) {
  return device.kind === 'audioinput'
}

/**
 * @param {{ kind: string }} device
 */
export function videoDevice(device) {
  return device.kind === 'videoinput'
}

/**
 * @param {Map<{}, {}>} mapLike
 */
export function getValuesFromArray(mapLike) {
  return Array.from(mapLike.values())
}

/**
 * Randomize array in-place using Durstenfeld shuffle algorithm
 * @param {[]} elements
 */
export function shuffle([...elements] = []) {
  for (let index = elements.length - 1; index > 0; index--) {
    const random = Math.floor(Math.random() * (index + 1))

    const iterator = elements[index]

    elements[index] = elements[random]
    elements[random] = iterator
  }

  return elements
}

/**
 * @param {string} text
 */
export function removeInterceptableText(text) {
  return text
    .replace(ModuleRegExp.intercept, '')
    .replace(ModuleRegExp.space, '')
}

/**
 * @param {import ('redux').Action} action
 * @returns {string}
 */
export function getEntity(action) {
  if (action.payload && action.payload.entity) {
    return action.payload.entity
  }
  return 'defaultEntity'
}

/**
 *
 * @param {string} initial
 * @param {string [] []} args
 */
export function buildQueryString(initial, args) {
  const url = new URLSearchParams()

  args.forEach(arg => {
    const [key, value] = arg

    url.append(key, value)
  })

  return initial.concat('?', url.toString())
}


/**
 * @param {{}} exercise
 * @param {[]} level
 * @returns {{}}
 */
export function isModular(data, level) {
  if ('modules' in data) {
    return {
      connected: true,
      context: data.modules[level]
    }
  }
  return {
    connected: false,
    context: data
  }
}

/**
 * @param {string} value
 * @returns {string}
 */
export function removeMatch(value = '') {
  return value.replace(ModuleRegExp.intercept, '')
}

export function removeSpace(value = '') {
  return value.replace(ModuleRegExp.space, '')
}

/**
 * @param {{ id: number }}
 */
export function getFilename({ id }) {
  return `speaking-user[${id}].mp3`
}

export function getAZCharArray() {
  const initial = 'A'.charCodeAt()

  const to = 'Z'.charCodeAt()

  return Array(Math.abs(initial - (to + 1)))
    .fill(initial)
    .map((num, index) => String.fromCharCode(num + index))
}
