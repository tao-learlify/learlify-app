import type { Knex } from 'knex'

exports.up = function (knex: Knex): unknown {
  return knex.schema.table('plans', table => {
    table.string('pandaUrl')
  })
}

exports.down = function (knex: Knex): unknown {
  return knex.schema.table('plans', table => {
    table.dropColumn('pandaUrl')
  })
}
