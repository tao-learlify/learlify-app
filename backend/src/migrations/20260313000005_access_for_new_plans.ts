import type { Knex } from 'knex'

const planAccess: Record<string, string[]> = {
  exam_essentials: ['EXAMS'],
  aptis_pro: ['EXAMS', 'COURSES', 'EVALUATIONS'],
  pro_max: ['EXAMS', 'COURSES', 'EVALUATIONS']
}

exports.up = async function (knex: Knex): Promise<void> {
  await knex.transaction(async trx => {
    for (const [code, features] of Object.entries(planAccess)) {
      const plan = await trx('plans').where({ code }).first()
      if (!plan) continue

      for (const feature of features) {
        const exists = await trx('access')
          .where({ planId: plan.id, feature })
          .first()
        if (!exists) {
          await trx('access').insert({ planId: plan.id, feature })
        }
      }
    }
  })
}

exports.down = async function (knex: Knex): Promise<void> {
  await knex.transaction(async trx => {
    const codes = Object.keys(planAccess)
    const plans = await trx('plans').whereIn('code', codes).select('id')
    const ids = plans.map((p: { id: number }) => p.id)

    if (ids.length > 0) {
      await trx('access').whereIn('planId', ids).delete()
    }
  })
}
