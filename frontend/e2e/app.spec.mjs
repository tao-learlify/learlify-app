/**
 * Learlify — End-to-End Test Suite
 *
 * Covers: login page, demo auth, page navigation, backend API contracts
 * POM: e2e/pages/LoginPage.mjs
 * API helpers: e2e/helpers/BackendClient.mjs
 *
 * Run: npx playwright test
 */

import { test as base, expect } from '@playwright/test'
import { LoginPage, BASE } from './pages/LoginPage.mjs'
import { BackendClient } from './helpers/BackendClient.mjs'

/* ────────────────────────────────────────────────────────────────────────────
   Fixtures
   ──────────────────────────────────────────────────────────────────────────── */
const test = base.extend({
  // Login via demo link once and reuse
  authedPage: async ({ page }, use) => {
    const login = new LoginPage(page)
    await login.goto()
    await login.isLoaded()
    await login.clickDemoLogin()
    await use(page)
  },
  api: async ({ request }, use) => {
    const client = new BackendClient(request)
    await use(client)
  }
})

/* ════════════════════════════════════════════════════════════════════════════
   SUITE 1 — Login Page UI Smoke Tests
   ════════════════════════════════════════════════════════════════════════════ */
test.describe('Login Page', () => {
  test('1.1 All required elements are visible', async ({ page }) => {
    const login = new LoginPage(page)
    await login.goto()
    await login.isLoaded()
    await expect(login.emailInput).toBeVisible()
    await expect(login.passwordInput).toBeVisible()
    await expect(login.demoLink).toBeVisible()
    await expect(login.signUpLink).toBeVisible()
  })

  test('1.2 Google authentication button is rendered', async ({ page }) => {
    const login = new LoginPage(page)
    await login.goto()
    await login.isLoaded()
    await expect(login.googleBtn).toBeVisible()
  })
})

/* ════════════════════════════════════════════════════════════════════════════
   SUITE 2 — Demo Authentication Flow
   ════════════════════════════════════════════════════════════════════════════ */
test.describe('Demo Authentication', () => {
  test('2.1 Redirects away from login page after demo click', async ({ page }) => {
    const login = new LoginPage(page)
    await login.goto()
    await login.isLoaded()
    await login.clickDemoLogin()
    expect(page.url()).not.toBe(BASE + '/')
  })

  test('2.2 React app renders content post-login', async ({ page }) => {
    const login = new LoginPage(page)
    await login.goto()
    await login.isLoaded()
    await login.clickDemoLogin()
    const rootText = await page.locator('#root').textContent()
    expect(rootText?.length).toBeGreaterThan(20)
  })
})

/* ════════════════════════════════════════════════════════════════════════════
   SUITE 3 — Authenticated Page Navigation
   ════════════════════════════════════════════════════════════════════════════ */
test.describe('Authenticated Pages', () => {
  test('3.1 Courses page renders content', async ({ authedPage }) => {
    await authedPage.goto(`${BASE}/courses`)
    await authedPage.waitForTimeout(3000)
    const text = await authedPage.locator('body').textContent()
    expect(text?.length).toBeGreaterThan(200)
  })

  test('3.2 Dashboard page renders content', async ({ authedPage }) => {
    await authedPage.goto(`${BASE}/dashboard`)
    await authedPage.waitForTimeout(3000)
    const text = await authedPage.locator('body').textContent()
    expect(text?.length).toBeGreaterThan(200)
  })

  test('3.3 Stats page renders content', async ({ authedPage }) => {
    await authedPage.goto(`${BASE}/stats`)
    await authedPage.waitForTimeout(3000)
    const text = await authedPage.locator('body').textContent()
    expect(text?.length).toBeGreaterThan(200)
  })
})

/* ════════════════════════════════════════════════════════════════════════════
   SUITE 4 — Backend API Contract Tests
   ════════════════════════════════════════════════════════════════════════════ */
test.describe('Backend API', () => {
  test('4.1 Auth — demo returns valid JWT', async ({ api }) => {
    const demo = await api.get('/auth/demo')
    expect(demo.statusCode).toBe(200)
    expect(demo.message).toBe('Login Successfully')
    expect(demo.response.token).toMatch(/^eyJ/)
    expect(demo.response.token.split('.')).toHaveLength(3)
  })

  test('4.2 Models — returns Aptis and IELTS', async ({ api }) => {
    const models = await api.get('/models', { auth: true })
    expect(models.statusCode).toBe(200)
    expect(Array.isArray(models.response)).toBe(true)
    const names = models.response.map(m => m.name)
    expect(names).toContain('Aptis')
    expect(names).toContain('IELTS')
  })

  test('4.3 Languages — returns configured languages', async ({ api }) => {
    const langs = await api.get('/languages', { auth: true })
    expect(langs.statusCode).toBe(200)
    expect(Array.isArray(langs.response)).toBe(true)
    expect(langs.response.length).toBeGreaterThan(0)
  })

  test('4.4 Exams — returns exams for Aptis model', async ({ api }) => {
    const exams = await api.get('/exams', { auth: true, query: { model: 'aptis' } })
    expect(exams.statusCode).toBe(200)
    expect(Array.isArray(exams.response)).toBe(true)
    expect(exams.response.length).toBeGreaterThanOrEqual(10)
  })

  test('4.5 Courses — returns learning units', async ({ api }) => {
    const courses = await api.get('/courses', { auth: true, query: { demo: 'true', model: 'aptis' } })
    expect(courses.statusCode).toBe(200)
    expect(Array.isArray(courses.response.units)).toBe(true)
    expect(courses.response.units.length).toBeGreaterThan(0)
  })

  test('4.6 Stats — returns chart data with labels', async ({ api }) => {
    const stats = await api.get('/stats', { auth: true, query: { model: 'aptis' } })
    expect(stats.statusCode).toBe(200)
    expect(stats.response).toHaveProperty('chart')
    expect(stats.response.chart).toHaveProperty('labels')
    expect(stats.response.chart.labels.length).toBeGreaterThan(0)
  })

  test('4.7 Evaluations — paginated results', async ({ api }) => {
    const evals = await api.get('/evaluations/all', { auth: true, query: { page: '1', model: 'aptis' } })
    expect(evals.statusCode).toBe(200)
    expect(evals.response).toBeDefined()
    expect(evals.pagination).toHaveProperty('currentPage')
    expect(evals.pagination).toHaveProperty('total')
  })

  test('4.8 Notifications — accessible', async ({ api }) => {
    const notifs = await api.get('/notifications/all', { auth: true, query: { unreads: 'true' } })
    expect(notifs).toBeDefined()
  })

  test('4.9 Schedule — stream accessible', async ({ api }) => {
    const schedule = await api.get('/schedule/stream', { auth: true })
    expect(schedule).toBeDefined()
  })
})

/* ════════════════════════════════════════════════════════════════════════════
   SUITE 5 — Network Loading Verification
   ════════════════════════════════════════════════════════════════════════════ */
test.describe('Network', () => {
  test('5.1 Login page loads all API modules', async ({ page }) => {
    const modules = []
    page.on('response', response => {
      const url = response.url()
      if (url.includes('/src/api/') && response.status() === 200) {
        modules.push(url.split('/').pop())
      }
    })

    const login = new LoginPage(page)
    await login.goto()
    await login.isLoaded()

    expect(modules.length).toBeGreaterThan(5)
  })
})
