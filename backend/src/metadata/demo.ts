type DemoContext = {
  DEMO: string
  isDemoUser(email: string): boolean
}

const context: DemoContext = {
  DEMO: 'aptisgo@noreply',
  isDemoUser(email: string): boolean {
    return this.DEMO.toLowerCase() === email.toLowerCase()
  }
}

export default context
