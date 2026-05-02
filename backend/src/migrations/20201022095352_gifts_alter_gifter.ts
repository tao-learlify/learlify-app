import type { Knex } from 'knex'

exports.up = function (knex: Knex): unknown {
  return knex.schema.table('gifts', function (table) {
    table
      .dropForeign('gifter')
    table
      .foreign('gifter')
      .references('users.id')
      .onUpdate('CASCADE')
      .onDelete('CASCADE')
  })
}

exports.down = function (knex: Knex): unknown {
  return knex.schema.table('gifts', function (table) {
    table
      .dropForeign('gifter')
    table
      .foreign('gifter')
      .references('users.id')
  })
}
