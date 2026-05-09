import type { Knex } from 'knex'

const tableName = 'plans'

exports.up = function (knex: Knex): unknown {
  return knex.schema.table(tableName, table => {
    table.string('code', 50).nullable().unique().after('name')
    table
      .boolean('includes_course')
      .notNullable()
      .defaultTo(false)
      .after('feature')
    table
      .integer('included_exams')
      .unsigned()
      .nullable()
      .after('includes_course')
    table
      .integer('included_speaking_reviews')
      .unsigned()
      .notNullable()
      .defaultTo(0)
      .after('included_exams')
    table
      .integer('included_writing_reviews')
      .unsigned()
      .notNullable()
      .defaultTo(0)
      .after('included_speaking_reviews')
    table
      .integer('sort_order')
      .unsigned()
      .notNullable()
      .defaultTo(0)
      .after('included_writing_reviews')
  })
}

exports.down = function (knex: Knex): unknown {
  return knex.schema.table(tableName, table => {
    table.dropColumn('code')
    table.dropColumn('includes_course')
    table.dropColumn('included_exams')
    table.dropColumn('included_speaking_reviews')
    table.dropColumn('included_writing_reviews')
    table.dropColumn('sort_order')
  })
}
