import type { Knex } from 'knex'

exports.up = function (knex: Knex): unknown {
  return knex.schema.createTable('exercises', table => {
    table.increments('id').primary()
    table.string('description', 1000)
    table.string('label', 1000)
    table.string('subtitle', 1000)
    table.integer('recordingTime')
    table.integer('strictOrder')
    table
      .integer('examId')
      .unsigned()
      .notNullable()
    table
      .foreign('examId')
      .references('exams.id')
      .onUpdate('CASCADE')
      .onDelete('CASCADE')
    table
      .integer('categoryId')
      .unsigned()
      .notNullable()
    table.foreign('categoryId').references('category.id')
  })
}

exports.down = function (knex: Knex): unknown {
  return knex.schema.dropTableIfExists('exercises')
}
