import type { Knex } from 'knex'

const tableName = 'subscriptions'

exports.up = function (knex: Knex): unknown {
  return knex.schema.createTable(tableName, table => {
    table.increments('id').primary()
    table
      .integer('user_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE')
    table
      .integer('plan_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('plans')
      .onDelete('RESTRICT')
    table
      .integer('plan_price_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('plan_prices')
      .onDelete('RESTRICT')
    table
      .enu('status', ['active', 'canceled', 'expired', 'past_due'])
      .notNullable()
      .defaultTo('active')
    table.enu('billing_cycle', ['monthly', 'quarterly', 'yearly']).notNullable()
    table.timestamp('started_at').notNullable().defaultTo(knex.fn.now())
    table.timestamp('current_period_start').notNullable()
    table.timestamp('current_period_end').notNullable()
    table.boolean('cancel_at_period_end').notNullable().defaultTo(false)
    table.timestamp('canceled_at').nullable()
    table.string('stripe_charge_id').nullable()
    table.string('stripe_customer_id').nullable()
    table.string('payment_method_id').nullable()
    table.string('idempotency_key').unique().notNullable()
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('updated_at').defaultTo(knex.fn.now())

    table.index(['user_id', 'status'])
    table.index(['current_period_end', 'status'])
  })
}

exports.down = function (knex: Knex): unknown {
  return knex.schema.dropTableIfExists(tableName)
}
