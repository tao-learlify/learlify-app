import type { Knex } from 'knex'

exports.up = function (knex: Knex): unknown {
  return knex.schema.table('packages', table => {
    table.timestamp('cancelledAt').nullable().defaultTo(null)
  })
}

exports.down = function (knex: Knex): unknown {
  return knex.schema.table('packages', table => {
    table.dropColumn('cancelledAt')
  })
}
