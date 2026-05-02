import type { Knex } from 'knex'

exports.up = function (knex: Knex): unknown {
  return knex.schema.table('stats', table => {
    table
      .integer('evaluationId')
      .unsigned()
    table
      .foreign('evaluationId')
      .references('evaluations.id')
      .onUpdate('CASCADE')
      .onDelete('CASCADE')
  })
}

exports.down = function (knex: Knex): unknown {
  return knex.schema.table('stats', table => {
    table.dropForeign('evaluationId')
    table.dropColumn('evaluationId')
  })
}
