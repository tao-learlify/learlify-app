import type { Knex } from 'knex'

exports.up = function (knex: Knex): unknown {
  return knex.schema.alterTable('users', table => {
    table
      .integer('roleId')
      .unsigned()
      .notNullable()
      .defaultTo(3)
      .alter()
  })
}

exports.down = function (knex: Knex): unknown {
  return knex.schema.alterTable('users', table => {
    table
      .integer('roleId')
      .unsigned()
      .notNullable()
      .alter()
  })
}
