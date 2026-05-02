import type { Knex } from 'knex'

exports.up = function (knex: Knex): unknown {
  const context = {
    classes: false,
    config: false,
    courses: false,
    dashboard: false,
    exams: {
      grammar: false,
      listening: false,
      reading: false,
      speakings: false,
      vocabulary: false,
      writings: false
    },
    gifts: false,
    pricing: false
  }
  return knex.schema.table('users', table => {
    table.json('tour').defaultTo(context)
  })
}

exports.down = function (knex: Knex): unknown {
  return knex.schema.table('users', table => {
    table.dropColumn('tour')
  })
}
