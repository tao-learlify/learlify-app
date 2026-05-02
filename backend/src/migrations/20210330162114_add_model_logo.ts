import type { Knex } from 'knex'

exports.up = function (knex: Knex): unknown {
  return knex.schema.table('exam_models', table => {
    table.string('logo').defaultTo(null)
  })
}

exports.down = function (knex: Knex): unknown {
  return knex.schema.table('exam_models', table => {
    table.dropColumn('logo')
  })
}
