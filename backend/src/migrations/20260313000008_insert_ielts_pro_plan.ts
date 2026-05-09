import type { Knex } from 'knex'

const plan = {
  code: 'ielts_pro',
  name: 'IELTS Pro',
  description:
    'Full IELTS exam preparation with courses, evaluations, and feedback',
  available: true,
  includes_course: true,
  included_exams: null,
  included_speaking_reviews: 5,
  included_writing_reviews: 5,
  sort_order: 25,
  modelId: 2,
  price: 2200,
  currency: 'EUR',
  classes: 0,
  speaking: 5,
  writing: 5,
  feature: 'EXAMS'
}

const prices: Array<[string, number, number]> = [
  ['monthly', 2200, 0],
  ['quarterly', 5940, 10],
  ['yearly', 17160, 35]
]

const features = ['EXAMS', 'COURSES', 'EVALUATIONS']

exports.up = async function (knex: Knex): Promise<void> {
  await knex.transaction(async trx => {
    const existing = await trx('plans').where({ code: plan.code }).first()
    if (existing) return

    const { code, ...rest } = plan
    const [planId] = await trx('plans').insert({ code, ...rest })

    for (const [billing_cycle, base_price, discount_percentage] of prices) {
      const final_price = Math.round(
        base_price * (1 - discount_percentage / 100)
      )
      await trx('plan_prices').insert({
        plan_id: planId,
        billing_cycle,
        currency: 'EUR',
        base_price,
        discount_percentage,
        final_price,
        active: true
      })
    }

    for (const feature of features) {
      const exists = await trx('access').where({ planId, feature }).first()
      if (!exists) {
        await trx('access').insert({ planId, feature })
      }
    }
  })
}

exports.down = async function (knex: Knex): Promise<void> {
  await knex.transaction(async trx => {
    const p = await trx('plans').where({ code: plan.code }).first()
    if (!p) return

    await trx('access').where({ planId: p.id }).delete()
    await trx('plan_prices').where({ plan_id: p.id }).delete()
    await trx('plans').where({ id: p.id }).delete()
  })
}
