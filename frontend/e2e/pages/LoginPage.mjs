/**
 * Page Object: LoginPage
 */
const BASE = process.env.BASE_URL || 'http://localhost:3000'

class LoginPage {
  constructor(page) {
    this.page = page
    this.emailInput = page.locator('input[type="email"], input[name="email"]')
    this.passwordInput = page.locator('input[type="password"]')
    this.demoLink = page.getByText(/access without an account/i)
    this.signUpLink = page.getByText(/sign up/i).first()
    this.googleBtn = page.getByText(/google/i)
    this.welcomeText = page.getByText(/welcome back|sign in/i).first()
  }

  async goto() {
    await this.page.goto(BASE)
    await this.page.waitForTimeout(1500)
    return this
  }

  async isLoaded() {
    await this.welcomeText.waitFor({ state: 'visible', timeout: 5000 })
    return true
  }

  async clickDemoLogin() {
    await this.demoLink.click()
    await this.page.waitForTimeout(3000)
  }

  async fillCredentials(email, password) {
    if (await this.emailInput.isVisible()) {
      await this.emailInput.fill(email)
    }
    if (await this.passwordInput.isVisible()) {
      await this.passwordInput.fill(password)
    }
  }
}

export { LoginPage, BASE }
