import type { Knex } from 'knex'

exports.up = function (knex: Knex): unknown {
  return knex.schema.table('exams', table => {
    table.string('imageUrl').defaultTo(null)
    table.string('alternImageUrl').defaultTo(null)
  })
}

exports.down = function (knex: Knex): unknown {
  return knex.schema.table('exams', table => {
    table.dropColumn('imageUrl')
    table.dropColumn('alternImageUrl')
  })
}
