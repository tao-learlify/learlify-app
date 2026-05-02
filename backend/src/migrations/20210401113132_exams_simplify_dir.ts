import type { Knex } from 'knex'

exports.up = async (knex: Knex): Promise<unknown> => {
  const exams = await knex('exams').select()

  return Promise.all(
    exams.map(exam =>
      knex('exams')
        .where({ id: exam.id })
        .update({
          dir: exam.dir.split('/').reverse()[0]
        })
    )
  )
}

exports.down = async (knex: Knex): Promise<unknown> => {
  const exams = await knex('exams').select()

  return Promise.all(
    exams.map(exam =>
      knex('exams')
        .where({ id: exam.id })
        .update({
          dir: 'https://dkmwdxc6g4lk7.cloudfront.net/exams/' + exam.dir
        })
    )
  )
}
