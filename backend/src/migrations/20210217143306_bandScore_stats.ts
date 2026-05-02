import type { Knex } from 'knex'

exports.up = function (knex: Knex): unknown {
  return knex.schema.table('stats', table => {
    table.integer('bandScore', 9).unsigned()
  })
}

exports.down = function (knex: Knex): unknown {
  return knex.schema.table('stats', table => {
    table.dropColumn('bandScore')
  })
}
