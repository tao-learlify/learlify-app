import httpClient from 'utils/httpClient'
import { httpMiddleware } from 'utils/middleware'


const meetingQualityAction = ({ assessment, teacher }) => async dispatch => {
  try {
    const quality = await httpClient({
      body: {
        assessment,
        
      },
      endpoint: '/api/v1/reports/quality',
      method: 'POST',
      requiresAuth: true
    })

    httpMiddleware(quality, ok => {
      
    })
  } catch (err) {

  }
}


export {
  meetingQualityAction
}