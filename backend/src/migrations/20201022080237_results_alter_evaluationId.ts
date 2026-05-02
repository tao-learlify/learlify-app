import type { Knex } from 'knex'

exports.up = function (knex: Knex): unknown {
  return knex.schema.table('results', function (table) {
    table
      .dropForeign('evaluationId')
    table
      .foreign('evaluationId')
      .references('evaluations.id')
      .onUpdate('CASCADE')
      .onDelete('CASCADE')
  })
}

exports.down = function (knex: Knex): unknown {
  return knex.schema.table('results', function (table) {
    table
      .dropForeign('evaluationId')
    table
      .foreign('evaluationId')
      .references('evaluations.id')
  })
}
