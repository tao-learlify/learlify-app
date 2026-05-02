import type { Knex } from 'knex'

exports.up = function (knex: Knex): unknown {
  return knex.schema.table('evaluations', table => {
    table.string('refVersion').defaultTo('v1')
  })
}

exports.down = function (knex: Knex): unknown {
  return knex.schema.table('evaluations', table => {
    table.dropColumn('refVersion')
  })
}
