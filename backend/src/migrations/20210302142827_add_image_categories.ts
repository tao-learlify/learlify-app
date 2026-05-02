import type { Knex } from 'knex'

exports.up = function (knex: Knex): unknown {
  return knex.schema.table('category', table => {
    table.string('imageUrl').defaultTo(null)
  })
}

exports.down = function (knex: Knex): unknown {
  return knex.schema.table('category', table => {
    table.dropColumn('imageUrl')
  })
}
