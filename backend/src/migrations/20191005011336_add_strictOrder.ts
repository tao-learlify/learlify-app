import type { Knex } from 'knex'

exports.up = function (knex: Knex): unknown {
  return knex.schema.table('questions', table => {
    table
      .integer('strictOrder')
      .unsigned()
  })
}

exports.down = function (knex: Knex): unknown {
  return knex.schema.table('questions', table => {
    table.dropColumn('strictOrder')
  })
}
