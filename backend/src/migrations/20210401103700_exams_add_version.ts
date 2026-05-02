import type { Knex } from 'knex'

exports.up = function (knex: Knex): unknown {
  return knex.schema.table('exams', table => {
    table.string('version').defaultTo('v1')
  })
}

exports.down = function (knex: Knex): unknown {
  return knex.schema.table('exams', table => {
    table.dropColumn('version')
  })
}
