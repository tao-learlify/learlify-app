import type { Knex } from 'knex'

exports.up = function (knex: Knex): unknown {
  return knex.schema.table('stats', table => {
    table
      .integer('examId')
      .unsigned()
    table
      .foreign('examId')
      .references('exams.id')
  })
}

exports.down = function (knex: Knex): unknown {
  return knex.schema.table('stats', table => {
    table.dropColumn('examId')
  })
}
