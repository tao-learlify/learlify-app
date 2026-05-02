import type { Knex } from 'knex'

exports.up = function (knex: Knex): unknown {
  return knex.schema.table('progress', table => {
    table.dropColumn('completed')
  })
}

exports.down = function (knex: Knex): unknown {
  return knex.schema.table('progress', table => {
    table.boolean('completed').notNullable().defaultTo(false)
  })
}
