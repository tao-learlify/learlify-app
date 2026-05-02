import type { Knex } from 'knex'

exports.up = function (knex: Knex): unknown {
  return knex.schema.table('latest_evaluations', table => {
    table.renameColumn('resultsJSON', 'data')
  })
}

exports.down = function (knex: Knex): unknown {
  return knex.schema.table('latest_evaluations', table => {
    table.renameColumn('data', 'resultsJSON')
  })
}
