import type { Knex } from 'knex'

exports.up = function (knex: Knex): unknown {
  return knex.schema.createTable('roles', table => {
    table.increments('id').primary()
    table.string('name').notNullable()
    table.timestamp('updatedAt').defaultTo(knex.fn.now())
    table.timestamp('createdAt').defaultTo(knex.fn.now())
  })
}

exports.down = function (knex: Knex): unknown {
  return knex.schema.dropTableIfExists('roles')
}
