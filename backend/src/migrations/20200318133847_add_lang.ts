import type { Knex } from 'knex'

exports.up = function (knex: Knex): unknown {
  return knex.schema.table('users', table => {
    table
      .string('lang')
      .defaultTo('es-US')
      .notNullable()
  })
}

exports.down = function (knex: Knex): unknown {
  return knex.schema.table('users', table => {
    table.dropColumn('lang')
  })
}
