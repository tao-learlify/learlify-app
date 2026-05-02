import type { Knex } from 'knex'

exports.up = function (knex: Knex): unknown {
  return knex.schema.createTable('stripe_events', table => {
    table.string('event_id').primary()
    table.string('type').notNullable()
    table.timestamp('processed_at').defaultTo(knex.fn.now())
  })
}

exports.down = function (knex: Knex): unknown {
  return knex.schema.dropTableIfExists('stripe_events')
}
