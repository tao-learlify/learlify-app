import type { Knex } from 'knex'

exports.up = function (knex: Knex): unknown {
  return knex.schema.table('classes', table => {
    table.boolean('expired').defaultTo(false)
  })
}

exports.down = function (knex: Knex): unknown {
  return knex.schema.table('classes', async table => {
    const exist = await knex.schema.hasColumn('classes', 'expired')

    if (exist) {
      table.dropColumn('expired')
    }
  })
}
