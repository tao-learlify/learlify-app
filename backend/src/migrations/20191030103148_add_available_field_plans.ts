import type { Knex } from 'knex'

exports.up = function (knex: Knex): unknown {
  return knex.schema.table('plans', table => {
    table
      .boolean('available')
      .notNullable()
      .defaultTo(true)
  })
}

exports.down = function (knex: Knex): unknown {
  return knex.schema.table('plans', table => {
    table.dropColumn('available')
  })
}
