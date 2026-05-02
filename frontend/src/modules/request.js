import httpClient from 'providers/http'

/**
 * @description
 * This function helps to manage statusCodes from the API Calls.
 * We should use to get this to create a scenario with most useful context about what is happening in our app.
 * @param {HttpRequest} httpRequest
 * @returns {HttpRequest}
 */
const getHttpRequestStatusCodeContext = httpRequest => {
  switch (httpRequest.statusCode) {
    case 401:
      return {
        ...httpRequest,
        unauthorized: true
      }

    case 400:
      return {
        ...httpRequest,
        badRequest: true
      }

    case 403:
      return {
        ...httpClient,
        unauthorized: true
      }
      
    case 402:
      return {
        ...httpRequest,
        requiresPayment: true
      }

    case 404:
      return {
        ...httpRequest,
        notFound: true
      }

    case 500:
      return {
        ...httpClient,
        internalServerError: true
      }

    case 501:
      return {
        ...httpClient,
        internalServerError: true
      }

    case 502:
      return {
        ...httpClient,
        internalServerError: true
      }

    case 503:
      return {
        ...httpClient,
        internalServerError: true
      }

    default:
      return httpRequest
  }
}

export { getHttpRequestStatusCodeContext }
