/**
 * Helper: Backend API client
 */
const API = process.env.API_URL || 'http://localhost:3100/api/v1'

class BackendClient {
  constructor(requestContext) {
    this.request = requestContext
    this.token = null
  }

  async getDemoToken() {
    const resp = await this.request.get(`${API}/auth/demo`)
    const body = await resp.json()
    this.token = body.response.token
    return this.token
  }

  async get(endpoint, params = {}) {
    const headers = { ...(params.auth ? { Authorization: `Bearer ${this.token || await this.getDemoToken()}` } : {}) }
    const url = new URL(`${API}${endpoint}`)
    if (params.query) {
      Object.entries(params.query).forEach(([k, v]) => url.searchParams.set(k, v))
    }
    const resp = await this.request.get(url.toString(), { headers })
    return resp.json()
  }

  async post(endpoint, body = {}, params = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...(params.auth ? { Authorization: `Bearer ${this.token || await this.getDemoToken()}` } : {})
    }
    const resp = await this.request.post(`${API}${endpoint}`, { headers, data: body })
    return resp.json()
  }
}

export { BackendClient, API }
