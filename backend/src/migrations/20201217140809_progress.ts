import type { Knex } from 'knex'

import { v4 as uuid } from 'uuid'

exports.up = function (knex: Knex): unknown {
  return knex.schema.alterTable('progress', table => {
    table
      .json('data')
      .defaultTo({
        uuuid: uuid(),
        'Grammar & Vocabulary': {
          feedback: [],
          lastIndex: 0,
          points: 0,
          score: 0
        },
        Listening: {
          feedback: [],
          lastIndex: 0,
          points: 0,
          score: 0
        },
        Reading: {
          feedback: [],
          lastIndex: 0,
          points: 0,
          score: 0
        },
        Speaking: {
          cloudStorageRef: [],
          lastIndex: 0
        },
        Writing: {
          feedback: [],
          lastIndex: 0
        }
      })
      .alter()
  })
}

exports.down = function (knex: Knex): unknown {
  return knex.schema.alterTable('progress', table => {
    table.json('data').defaultTo(null).alter()
  })
}
