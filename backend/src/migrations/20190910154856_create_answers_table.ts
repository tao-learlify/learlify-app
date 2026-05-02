import type { Knex } from 'knex'

exports.up = function (knex: Knex): unknown {
  return knex.schema.createTable('answers', table => {
    table.increments('id').primary()
    table.string('title')
    table.boolean('isCorrect').defaultTo(false)
    table
      .integer('questionId')
      .unsigned()
      .notNullable()
    table
      .foreign('questionId')
      .references('questions.id')
      .onUpdate('CASCADE')
      .onDelete('CASCADE')
  })
}

exports.down = function (knex: Knex): unknown {
  return knex.schema.dropTableIfExists('answers')
}
