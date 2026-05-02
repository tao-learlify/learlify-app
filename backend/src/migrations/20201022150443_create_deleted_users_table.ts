import type { Knex } from 'knex'

exports.up = function (knex: Knex): unknown {
  return knex.schema.createTable('deleted_users', table => {
    table.increments('id').primary()
    table.integer('userId').notNullable().unique()
    table.string('email').notNullable().unique()
    table.string('firstName').notNullable()
    table.string('lastName').notNullable()
    table.timestamp('updatedAt').defaultTo(knex.fn.now())
    table.timestamp('createdAt').defaultTo(knex.fn.now())
  })
}

exports.down = function (knex: Knex): unknown {
  return knex.schema.dropTableIfExists('deleted_users')
}
