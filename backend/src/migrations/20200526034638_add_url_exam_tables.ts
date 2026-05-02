import type { Knex } from 'knex'

exports.up = function (knex: Knex): unknown {
  return knex.schema.table('exams', table => {
    table.string('url').notNullable().defaultTo('https://aws.com/filename')
  })
}

exports.down = function (knex: Knex): unknown {
  return knex.schema.table('exams', table => {
    table.dropColumn('url')
  })
}
