import type { Knex } from 'knex'

exports.up = function (): Promise<void> {
  return Promise.resolve()
}

exports.down = function (knex: Knex): unknown {
  return knex.schema.dropTableIfExists('units')
}
