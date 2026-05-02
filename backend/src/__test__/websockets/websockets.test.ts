import http from 'http'
import { Server } from 'socket.io'
import { io as ioClient } from 'socket.io-client'
import jwt from 'jsonwebtoken'

const TEST_SECRET = 'test-ws-secret-key'
const TEST_PORT = 4099

let httpServer
let ioServer
let serverUrl

const validToken = () =>
  jwt.sign({ id: 1, email: 'test@learlify.com', role: 'student' }, TEST_SECRET, {
    algorithm: 'HS256',
    expiresIn: '1h'
  })

const createClient = (opts = {}) =>
  ioClient(serverUrl, {
    transports: ['websocket'],
    forceNew: true,
    ...opts
  })

beforeAll(done => {
  httpServer = http.createServer()
  ioServer = new Server(httpServer, {
    cors: { origin: '*' },
    allowEIO3: true
  })

  ioServer.use((socket, next) => {
    const token = socket.handshake.auth?.token || socket.handshake.query?.token

    if (!token) {
      return next(new Error('unauthorized'))
    }

    jwt.verify(token, TEST_SECRET, { algorithms: ['HS256'] }, (err, decoded) => {
      if (err) {
        return next(new Error('unauthorized'))
      }

      socket.user = decoded
      next()
    })
  })

  ioServer.on('connection', socket => {
    socket.emit('USER_ASSERT', { ping: true })
  })

  httpServer.listen(TEST_PORT, () => {
    serverUrl = `http://localhost:${TEST_PORT}`
    done()
  })
})

afterAll(done => {
  ioServer.disconnectSockets(true)
  ioServer.close()
  httpServer.close(done)
})

describe('socket.io v4 — auth middleware', () => {
  it('rechaza conexión sin token', done => {
    const client = createClient()

    client.on('connect_error', err => {
      expect(err.message).toBe('unauthorized')
      client.disconnect()
      done()
    })

    client.on('connect', () => {
      client.disconnect()
      done(new Error('no debería conectar sin token'))
    })
  })

  it('rechaza conexión con token inválido (auth object)', done => {
    const client = createClient({ auth: { token: 'invalid.jwt.token' } })

    client.on('connect_error', err => {
      expect(err.message).toBe('unauthorized')
      client.disconnect()
      done()
    })

    client.on('connect', () => {
      client.disconnect()
      done(new Error('no debería conectar con token inválido'))
    })
  })

  it('rechaza conexión con token inválido (query fallback)', done => {
    const client = createClient({ query: { token: 'bad-token' } })

    client.on('connect_error', err => {
      expect(err.message).toBe('unauthorized')
      client.disconnect()
      done()
    })

    client.on('connect', () => {
      client.disconnect()
      done(new Error('no debería conectar con query token inválido'))
    })
  })

  it('acepta conexión con token válido en auth object (patrón v4)', done => {
    const client = createClient({ auth: { token: validToken() } })

    client.on('connect', () => {
      expect(client.connected).toBe(true)
      client.disconnect()
      done()
    })

    client.on('connect_error', done)
  })

  it('acepta conexión con token válido en query (compat v2 — allowEIO3)', done => {
    const client = createClient({ query: { token: validToken() } })

    client.on('connect', () => {
      expect(client.connected).toBe(true)
      client.disconnect()
      done()
    })

    client.on('connect_error', done)
  })
})

describe('socket.io v4 — USER_ASSERT ping', () => {
  it('recibe USER_ASSERT { ping: true } al conectar', done => {
    const client = createClient({ auth: { token: validToken() } })

    client.on('USER_ASSERT', payload => {
      expect(payload).toEqual({ ping: true })
      client.disconnect()
      done()
    })

    client.on('connect_error', done)
  })
})

describe('socket.io v4 — rooms (Set)', () => {
  it('socket.rooms es iterable (compatible con [...socket.rooms])', done => {
    const client = createClient({ auth: { token: validToken() } })

    client.on('connect', () => {
      const [serverSocket] = ioServer.sockets.sockets.values()

      expect(() => [...serverSocket.rooms]).not.toThrow()
      expect(serverSocket.rooms instanceof Set).toBe(true)
      expect([...serverSocket.rooms]).toContain(serverSocket.id)

      client.disconnect()
      done()
    })

    client.on('connect_error', done)
  })

  it('socket.join() une al socket a la room', done => {
    const client = createClient({ auth: { token: validToken() } })

    client.on('connect', async () => {
      const [serverSocket] = ioServer.sockets.sockets.values()

      serverSocket.join('test-room')
      expect([...serverSocket.rooms]).toContain('test-room')

      client.disconnect()
      done()
    })

    client.on('connect_error', done)
  })
})
