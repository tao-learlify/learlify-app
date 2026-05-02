import type { Knex } from 'knex'

exports.up = function (knex: Knex): unknown {
  return knex.schema.table('users', table => {
    table
      .string('facebookId')
      .nullable()
      .defaultTo(null)
  })
}

exports.down = function (knex: Knex): unknown {
  return knex.schema.table('users', table => {
    table.dropColumn('facebookId')
  })
}
