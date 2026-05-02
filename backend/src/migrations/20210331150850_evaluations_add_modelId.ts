import type { Knex } from 'knex'

exports.up = function (knex: Knex): unknown {
  return knex.schema.table('evaluations', table => {
    table
      .integer('examId')
      .unsigned()
    table
      .foreign('examId')
      .references('exams.id')
      .onUpdate('CASCADE')
      .onDelete('CASCADE')
  })
}

exports.down = function (knex: Knex): unknown {
  return knex.schema.table('evaluations', table => {
    table.dropForeign('examId')
    table.dropColumn('examId')
  })
}
