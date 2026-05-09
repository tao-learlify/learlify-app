import type { Knex } from 'knex'

const tableName = 'plan_prices'

exports.up = function (knex: Knex): unknown {
  return knex.schema.createTable(tableName, table => {
    table.increments('id').primary()
    table
      .integer('plan_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('plans')
      .onDelete('CASCADE')
    table.enu('billing_cycle', ['monthly', 'quarterly', 'yearly']).notNullable()
    table.string('currency', 3).notNullable().defaultTo('EUR')
    table.integer('base_price').unsigned().notNullable()
    table.decimal('discount_percentage', 5, 2).notNullable().defaultTo(0)
    table.integer('final_price').unsigned().notNullable()
    table.boolean('active').notNullable().defaultTo(true)
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('updated_at').defaultTo(knex.fn.now())

    table.unique(['plan_id', 'billing_cycle', 'currency'])
  })
}

exports.down = function (knex: Knex): unknown {
  return knex.schema.dropTableIfExists(tableName)
}
