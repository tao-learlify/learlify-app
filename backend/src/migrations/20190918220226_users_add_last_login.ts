import type { Knex } from 'knex'

exports.up = function (knex: Knex): unknown {
  return knex.schema.table('users', table => {
    table
      .string('lastLogin')
      .nullable()
      .defaultTo(null)
  })
}

exports.down = function (knex: Knex): unknown {
  return knex.schema.table('users', table => {
    table.dropColumn('lastLogin')
  })
}
