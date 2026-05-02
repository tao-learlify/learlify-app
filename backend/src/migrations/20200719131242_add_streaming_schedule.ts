import type { Knex } from 'knex'

exports.up = function (knex: Knex): unknown {
  return knex.schema.table('schedule', table => {
    table.boolean('streaming').defaultTo(false)
  })
}

exports.down = function (knex: Knex): unknown {
  return knex.schema.table('schedule', table => {
    table.dropColumn('streaming')
  })
}
