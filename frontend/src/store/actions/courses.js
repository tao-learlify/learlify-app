import httpClient from 'utils/httpClient'
import { httpMiddleware } from 'utils/middleware'
import {
  getCourses,
  serviceFailWithStatusCode,
  serviceError,
  getCloudfrontResource,
  fetchingAdvanceRequest,
  fetchAdvanceSuccess,
  updateAdvanceSuccess, notify
} from './action'
import { getCloudfront } from 'utils/courses'
import { INSCRIPTION } from 'store/notifications'

/**
 * @returns {() => import ('redux').Dispatch}
 */
export const fetchCoursesAction = () => async dispatch => {
  try {
    /**
     * @description
     * Starting request to make "loading" state.
     */
    dispatch(getCourses())

    const courses = await httpClient({
      endpoint: '/api/v1/courses',
      method: 'GET',
      requiresAuth: true
    })

    httpMiddleware(courses, async ok => {
      if (ok) {
        const fileIndex = 1

        const [course] = courses.response

        const url = getCloudfront(course).split('cloudfront.net/')

        /**
         * With an object as argument we catch the response and ends the request.
         */
        dispatch(getCourses(courses.response))

        dispatch(getCloudfrontResource())

        const cloudfrontRequest = await httpClient({
          endpoint: '/api/v1/aws',
          method: 'GET',
          queries: {
            filename: url[fileIndex],
            key: 'courses'
          },
          requiresAuth: true
        })

        return dispatch(getCloudfrontResource(cloudfrontRequest.response))
      }
      dispatch(serviceFailWithStatusCode(courses.statusCode))
    })
  } catch (err) {
    dispatch(serviceError())
  }
}

/**
 * @description
 * Starts a course giving the id, and the userId to the REST API.
 * @param {{ courseId: number, userId: number }} params
 * @returns {() => import ('redux').Dispatch}
 */
export const onStartCourseAction = params => async dispatch => {
  try {
    const inscription = await httpClient({
      body: {
        courseId: params.courseId
      },
      endpoint: '/api/v1/courses',
      method: 'POST',
      queries: {
        inscription: true
      },
      requiresAuth: true
    })

    httpMiddleware(inscription, ok => {
      if (ok) {
        return dispatch(
          notify(
            'Inscripción completada',
            inscription.response,
            INSCRIPTION
          )
        )
      }
      dispatch(serviceFailWithStatusCode(inscription.statusCode))
    })
  } catch (err) {
    dispatch(serviceError())
  }
}

/**
 * @typedef {Object} AWSOptions
 * @property {string} url
 * @property {string} key
 * @param {AWSOptions} params
 * @returns {() => import ('redux').Dispatch}
 */
export const fetchAWSCloudfrontResource = params => async dispatch => {
  try {
    dispatch(getCloudfrontResource())

    const resource = await httpClient({
      endpoint: '/api/v1/aws',
      method: 'GET',
      queries: {
        key: params.key,
        filename: params.url
      },
      requiresAuth: true
    })

    httpMiddleware(resource, ok => {
      if (ok) {
        return dispatch(getCloudfrontResource(resource.response))
      }
      dispatch(serviceFailWithStatusCode(resource.statusCode))
    })
  } catch (err) {
    dispatch(serviceError())
  }
}


/**
 * @param {AdvanceProperties} data
 * @returns {() => import ('redux').Dispatch}
 *
 */
export const updateAdvanceAction = ({ content, courseId }) => async dispatch => {
  try {
    const advance = await httpClient({
      body: {
        courseId,
        content
      },
      endpoint: '/api/v1/advance',
      method: 'PUT',
      requiresAuth: true
    })


    httpMiddleware(advance, ok => {
      if (ok) {
        return dispatch(updateAdvanceSuccess(advance.response))
      }
      dispatch(serviceFailWithStatusCode(advance.statusCode))
    })  
  } catch (err) {
    dispatch(serviceError())
  }
}


/**
 * @param {AdvanceProperties} data
 * @returns {() => import ('redux').Dispatch}
 */
export const fetchAdvanceAction = data => async dispatch => {
  try {
    dispatch(fetchingAdvanceRequest())

    const advance = await httpClient({
      endpoint: '/api/v1/advance',
      method: 'GET',
      queries: {
        courseId: data.courseId
      },
      requiresAuth: true
    })

    httpMiddleware(advance, ok => {
      if (ok) {
        return dispatch(fetchAdvanceSuccess(advance.response))
      }
      dispatch(serviceFailWithStatusCode(advance.statusCode))
    })
  } catch (err) {
    dispatch(serviceError())
  }
}
