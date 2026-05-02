import type { Knex } from 'knex'

import STATUS from '../api/stats/stats.status'

exports.up = function (knex: Knex): unknown {
  return knex.schema.createTable('stats', table => {
    table.increments('id').primary()
    table
      .integer('categoryId')
      .unsigned()
      .notNullable()
    table
      .integer('userId')
      .unsigned()
      .notNullable()
    table.foreign('categoryId').references('category.id')
    table.foreign('userId').references('users.id')
    table.enu('marking', STATUS.asArray()).notNullable()
    table
      .integer('points')
      .unsigned()
      .notNullable()
      .defaultTo(0)
    table.timestamp('updatedAt').defaultTo(knex.fn.now())
    table.timestamp('createdAt').defaultTo(knex.fn.now())
  })
}

exports.down = function (knex: Knex): unknown {
  return knex.schema.dropTableIfExists('stats')
}
