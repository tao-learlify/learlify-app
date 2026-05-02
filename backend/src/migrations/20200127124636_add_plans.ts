import type { Knex } from 'knex'

exports.up = function (knex: Knex): unknown {
  return knex('plans').insert({
    name: 'Curso Aptis',
    currency: 'EUR',
    writing: 0,
    speaking: 0,
    price: 1499
  })
}

exports.down = function (knex: Knex): unknown {
  return knex('plans').where('name', 'Curso Aptis').del()
}
