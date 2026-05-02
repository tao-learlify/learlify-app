import type { Knex } from 'knex'

exports.up = function (knex: Knex): unknown {
  return knex.schema.table('exams', table => {
    table
      .integer('examModelId')
      .unsigned()
      .notNullable()
      .defaultTo(1)
    table
      .foreign('examModelId')
      .references('exam_models.id')
  })
}

exports.down = function (knex: Knex): unknown {
  return knex.schema.table('exams', table => {
    table.dropForeign('examModelId')
    table.dropColumn('examModelId')
  })
}
