import type { Knex } from 'knex'

import config from '../config'

exports.up = function (knex: Knex): unknown {
  return knex.schema.table('meetings', table => {
    table.string('timezone').notNullable().defaultTo((config as any).default?.TZ || config.TZ || 'Europe/Madrid')
  })
}

exports.down = function (knex: Knex): unknown {
  return knex.schema.table('meetings', table => {
    table.dropColumn('timezone')
  })
}
