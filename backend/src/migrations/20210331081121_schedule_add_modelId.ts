import type { Knex } from 'knex'

exports.up = function (knex: Knex): unknown {
  return knex.schema.table('schedule', table => {
    table
      .integer('modelId')
      .unsigned()
      .notNullable()
      .defaultTo(1)
    table
      .foreign('modelId')
      .references('exam_models.id')
      .onUpdate('CASCADE')
      .onDelete('CASCADE')
  })
}

exports.down = function (knex: Knex): unknown {
  return knex.schema.table('schedule', table => {
    table.dropForeign('modelId')
    table.dropColumn('modelId')
  })
}
