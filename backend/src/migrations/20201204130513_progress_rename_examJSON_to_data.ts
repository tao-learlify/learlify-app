import type { Knex } from 'knex'

exports.up = function (knex: Knex): unknown {
  return knex.schema.table('progress', table => {
    table.renameColumn('examJSON', 'data')
  })
}

exports.down = function (knex: Knex): unknown {
  return knex.schema.table('progress', table => {
    table.renameColumn('data', 'examJSON')
  })
}
