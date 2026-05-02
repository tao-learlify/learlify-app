import type { Knex } from 'knex'

import moment from 'moment'

exports.up = function (knex: Knex): unknown {
  return knex('users').update({
    lastLogin: moment().format('YYYY-MM-DD')
  })
}

exports.down = function (): Promise<void> {
  return Promise.resolve()
}
