import type { Knex } from 'knex'

const newPlans = [
  {
    code: 'exam_essentials',
    name: 'Exam Essentials',
    description: 'Access to exams and basic evaluations',
    available: true,
    includes_course: false,
    included_exams: null,
    included_speaking_reviews: 2,
    included_writing_reviews: 2,
    sort_order: 10,
    price: 1200,
    currency: 'EUR',
    classes: 0,
    speaking: 2,
    writing: 2,
    feature: 'EXAMS'
  },
  {
    code: 'aptis_pro',
    name: 'Aptis Pro',
    description: 'Full access to exams, courses, and evaluations',
    available: true,
    includes_course: true,
    included_exams: null,
    included_speaking_reviews: 5,
    included_writing_reviews: 5,
    sort_order: 20,
    price: 2200,
    currency: 'EUR',
    classes: 0,
    speaking: 5,
    writing: 5,
    feature: 'EXAMS'
  },
  {
    code: 'pro_max',
    name: 'Pro Max',
    description:
      'Complete preparation with unlimited access and priority feedback',
    available: true,
    includes_course: true,
    included_exams: null,
    included_speaking_reviews: 10,
    included_writing_reviews: 10,
    sort_order: 30,
    price: 3900,
    currency: 'EUR',
    classes: 0,
    speaking: 10,
    writing: 10,
    feature: 'EXAMS'
  }
]

const priceMatrix: Record<string, Array<[string, number, number]>> = {
  exam_essentials: [
    ['monthly', 1200, 0],
    ['quarterly', 3240, 10],
    ['yearly', 9360, 35]
  ],
  aptis_pro: [
    ['monthly', 2200, 0],
    ['quarterly', 5940, 10],
    ['yearly', 17160, 35]
  ],
  pro_max: [
    ['monthly', 3900, 0],
    ['quarterly', 10530, 10],
    ['yearly', 30420, 35]
  ]
}

exports.up = async function (knex: Knex): Promise<void> {
  await knex.transaction(async trx => {
    for (const planData of newPlans) {
      const { code, ...rest } = planData

      const existing = await trx('plans').where({ code }).first()
      if (existing) continue

      const [planId] = await trx('plans').insert({ code, ...rest })

      const cycles = priceMatrix[code]
      for (const [billing_cycle, base_price, discount_percentage] of cycles) {
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
    }
  })
}

exports.down = async function (knex: Knex): Promise<void> {
  await knex.transaction(async trx => {
    const codes = newPlans.map(p => p.code)
    const plans = await trx('plans').whereIn('code', codes).select('id')
    const ids = plans.map((p: { id: number }) => p.id)

    if (ids.length > 0) {
      await trx('plan_prices').whereIn('plan_id', ids).delete()
      await trx('plans').whereIn('id', ids).delete()
    }
  })
}
