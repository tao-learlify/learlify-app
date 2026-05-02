import type { Knex } from 'knex'

exports.up = function (knex: Knex): unknown {
  return knex.schema.createTable('advance', table => {
    table.increments('id').primary()
    table.integer('userId').unsigned().notNullable()
    table.integer('courseId').unsigned().notNullable()
    table.json('content')
    table
      .foreign('userId')
      .references('users.id')
      .onUpdate('CASCADE')
      .onDelete('CASCADE')
    table
      .foreign('courseId')
      .references('courses.id')
      .onUpdate('CASCADE')
      .onDelete('CASCADE')
    table.timestamp('createdAt').defaultTo(knex.fn.now())
  })
}

exports.down = function (knex: Knex): unknown {
  return knex.schema.dropTableIfExists('advance')
}
