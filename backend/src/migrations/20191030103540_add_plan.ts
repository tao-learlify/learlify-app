import type { Knex } from 'knex'

exports.up = function (knex: Knex): unknown {
  return knex('plans').insert({
    name: 'Go',
    currency: 'EUR',
    writing: 0,
    speaking: 0,
    price: 500
  })
}

exports.down = function (knex: Knex): unknown {
  return knex.schema.dropTableIfExists('plans')
}
