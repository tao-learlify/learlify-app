import type { Knex } from 'knex'

exports.up = function (knex: Knex): unknown {
  return knex.schema.table('packages', table => {
    table
      .integer('classes')
      .notNullable()
      .defaultTo(0)
  })
}

exports.down = function (knex: Knex): unknown {
  return knex.schema.table('packages', table => {
    table.dropColumn('classes')
  })
}
