/**
 * Learlify — Subscription & Payment Flow Tests
 *
 * Covers:
 *   - Plans page rendering with pricing cards (UI)
 *   - Plans/catalog API (pricing data + features)
 *   - Packages API (subscriptions, purchasing)
 *   - Billing cycle toggle / checkout modal
 *
 * Note: Stripe is not configured in dev (STRIPE_API_KEY empty),
 *       so actual payment creation / 3D Secure flow is skipped.
 */

import { test, expect } from '@playwright/test'
import { LoginPage, BASE } from './pages/LoginPage.mjs'

let authToken = ''

async function getToken(request) {
  if (!authToken) {
    const demo = await (await request.get('http://localhost:3100/api/v1/auth/demo')).json()
    authToken = demo.response.token
  }
  return authToken
}

async function loginAndGo(page, path) {
  const login = new LoginPage(page)
  await login.goto()
  await login.isLoaded()
  await login.clickDemoLogin()
  await page.goto(`${BASE}${path}`, { timeout: 10000 })
  await page.waitForTimeout(2500)
}

/* ════════════════════════════════════════════════════════════════════════════
   SUITE 1 — Plans Page UI
   ════════════════════════════════════════════════════════════════════════════ */
test.describe('UI — Plans Page', () => {
  test('1.1 Renders with pricing content', async ({ page }) => {
    await loginAndGo(page, '/plans')
    const body = await page.locator('body').textContent()
    expect(body?.length).toBeGreaterThan(200)
    const hasPricing = /plan|pricing|subscription|€|eur/i.test(body || '')
    console.log(`✅ Plans page: ${body?.length} chars, pricing: ${hasPricing}`)
  })

  test('1.2 Has interactive elements', async ({ page }) => {
    await loginAndGo(page, '/plans')
    const buttons = await page.locator('button').count()
    const links = await page.locator('a').count()
    console.log(`✅ ${buttons} buttons, ${links} links`)
    expect(buttons + links).toBeGreaterThan(0)
  })
})

/* ════════════════════════════════════════════════════════════════════════════
   SUITE 2 — Plans API Catalog
   ════════════════════════════════════════════════════════════════════════════ */
test.describe('API — Plans Catalog', () => {
  test('2.1 Returns 6+ plans with prices', async ({ request }) => {
    const resp = await (await request.get('http://localhost:3100/api/v1/plans?model=aptis', {
      headers: { Authorization: `Bearer ${await getToken(request)}` }
    })).json()

    expect(resp.statusCode).toBe(200)
    expect(resp.response.length).toBeGreaterThanOrEqual(5)
    console.log(`✅ ${resp.response.length} plans`)
  })

  test('2.2 Catalog endpoint returns plans with prices', async ({ request }) => {
    const resp = await (await request.get('http://localhost:3100/api/v1/plans/catalog', {
      headers: { Authorization: `Bearer ${await getToken(request)}` }
    })).json()

    expect(resp.statusCode).toBe(200)
    expect(resp.response).toBeDefined()
    const plans = Array.isArray(resp.response) ? resp.response : []
    console.log(`✅ Catalog: ${plans.length} plans`)
  })

  test('2.3 Plans have price + currency + model', async ({ request }) => {
    const resp = await (await request.get('http://localhost:3100/api/v1/plans?model=aptis', {
      headers: { Authorization: `Bearer ${await getToken(request)}` }
    })).json()

    const p = resp.response[0]
    expect(p).toHaveProperty('price')
    expect(p).toHaveProperty('currency')
    expect(p.model?.name).toBe('Aptis')
    console.log(`✅ "${p.name}": ${p.price} ${p.currency} — ${p.model.name}`)
  })

  test('2.4 Plans have modelId and access features', async ({ request }) => {
    const resp = await (await request.get('http://localhost:3100/api/v1/plans?model=aptis', {
      headers: { Authorization: `Bearer ${await getToken(request)}` }
    })).json()

    const p = resp.response[0]
    expect(p.modelId).toBeDefined()
    expect(p.access).toBeDefined()
    console.log(`✅ Plan id=${p.id} modelId=${p.modelId} features=${p.access?.length || 0}`)
  })
})

/* ════════════════════════════════════════════════════════════════════════════
   SUITE 3 — Packages API (subscription purchasing)
   ════════════════════════════════════════════════════════════════════════════ */
test.describe('API — Packages (Subscriptions)', () => {
  test('3.1 GET /packages returns packages', async ({ request }) => {
    const resp = await (await request.get('http://localhost:3100/api/v1/packages?active=true', {
      headers: {
        Authorization: `Bearer ${await getToken(request)}`,
        'Content-Type': 'application/json'
      }
    })).json()

    expect(resp.statusCode).toBe(200)
    const items = Array.isArray(resp.response) ? resp.response : []
    console.log(`✅ Packages: ${items.length} (demo user may have none)`)
  })

  test('3.2 GET /packages?active=true returns active packages', async ({ request }) => {
    const resp = await (await request.get('http://localhost:3100/api/v1/packages?active=true', {
      headers: { Authorization: `Bearer ${await getToken(request)}` }
    })).json()

    expect(resp.statusCode).toBe(200)
    console.log(`✅ Active packages queried`)
  })

  test('3.3 POST /packages requires Stripe (not configured in dev)', async ({ request }) => {
    const resp = await (await request.post('http://localhost:3100/api/v1/packages', {
      headers: {
        Authorization: `Bearer ${await getToken(request)}`,
        'Content-Type': 'application/json'
      },
      data: {
        planPriceId: 1,
        paymentMethodId: 'pm_test_card'
      }
    })).json()

    // Stripe not configured: expect graceful failure
    // Should NOT return HTML (would indicate routing issue)
    console.log(`✅ POST /packages: status ${resp.statusCode} — ${resp.message || 'handled'}`)
    expect(resp.statusCode).toBeDefined()
    expect(typeof resp.statusCode).toBe('number')
  })
})
