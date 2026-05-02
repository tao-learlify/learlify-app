import type { Knex } from 'knex'

exports.up = function (knex: Knex): unknown {
  return knex.schema.table('stats', function (table) {
    table
      .dropForeign('userId')
    table
      .foreign('userId')
      .references('users.id')
      .onUpdate('CASCADE')
      .onDelete('CASCADE')
  })
}

exports.down = function (knex: Knex): unknown {
  return knex.schema.table('stats', function (table) {
    table
      .dropForeign('userId')
    table
      .foreign('userId')
      .references('users.id')
  })
}
