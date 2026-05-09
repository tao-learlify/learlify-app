import type { Knex } from 'knex'

exports.up = function (knex: Knex): unknown {
  return knex.schema.table('users', table => {
    table.string('telegramId').defaultTo(null)
  })
}

exports.down = function (knex: Knex): unknown {
  return knex.schema.table('users', table => {
    table.dropColumn('telegramId')
  })
}
