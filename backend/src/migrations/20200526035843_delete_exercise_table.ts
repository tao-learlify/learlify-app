import type { Knex } from 'knex'

exports.up = function (knex: Knex): unknown {
  return knex.schema.dropTableIfExists('answers').then(() => {
    knex.schema.dropTableIfExists('questions').then(() => {
      knex.schema.dropTableIfExists('exercises')
    })
  })
}

exports.down = function (knex: Knex): unknown {
  return knex.schema.dropTableIfExists('answers')
}
