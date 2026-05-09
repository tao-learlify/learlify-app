import type { Knex } from 'knex'

const legacyPlanNames = [
  'Silver',
  'Gold',
  'Green',
  'Master',
  'Grand Master',
  'Ruby',
  'Curso Aptis',
  'Blue',
  'Diamond',
  'Platinum',
  'Go',
  'Curso IELTS'
]

exports.up = async function (knex: Knex): Promise<void> {
  await knex('plans')
    .whereIn('name', legacyPlanNames)
    .whereNull('code')
    .update({ available: false })
}

exports.down = async function (knex: Knex): Promise<void> {
  await knex('plans')
    .whereIn('name', legacyPlanNames)
    .whereNull('code')
    .update({ available: true })
}
