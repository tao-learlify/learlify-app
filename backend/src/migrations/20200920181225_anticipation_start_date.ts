import type { Knex } from 'knex'

exports.up = function (knex: Knex): unknown {
  return knex.schema.table('schedule', table => {
    table.dateTime('anticipatedStartDate')
  })
}

exports.down = function (knex: Knex): unknown {
  return knex.schema.table('schedule', table => {
    table.dropColumn('anticipatedStartDate')
  })
}
