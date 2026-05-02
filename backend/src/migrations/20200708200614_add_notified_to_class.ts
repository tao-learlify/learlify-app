import type { Knex } from 'knex'

import { v4 as uuid } from 'uuid'

exports.up = function (knex: Knex): unknown {
  return knex.schema.table('classes', table => {
    table.string('name').defaultTo(uuid())
  })
}

exports.down = function (knex: Knex): unknown {
  return knex.schema.table('classes', table => {
    table.dropColumn('name')
  })
}
