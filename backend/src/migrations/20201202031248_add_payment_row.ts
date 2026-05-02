import type { Knex } from 'knex'

exports.up = function (knex: Knex): unknown {
  return knex.schema.table('exams', table => {
    table.boolean('requiresPayment')
      .notNullable()
      .defaultTo(true)
  })
}

exports.down = function (knex: Knex): unknown {
  return knex.schema.table('exams', table => {
    table.dropColumn('requiresPayment')
  })
}
