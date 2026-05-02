import type { Knex } from 'knex'

exports.up = function (knex: Knex): unknown {
  return knex.schema.createTable('plans', table => {
    table.increments('id').primary()
    table.string('name')
    table.string('description')
    table.string('currency').notNullable()
    table.integer('writing')
    table.integer('speaking')
    table.integer('price').notNullable()
    table.timestamp('updatedAt').defaultTo(knex.fn.now())
    table.timestamp('createdAt').defaultTo(knex.fn.now())
  })
}

exports.down = function (knex: Knex): unknown {
  return knex.schema.dropTableIfExists('plans')
}
