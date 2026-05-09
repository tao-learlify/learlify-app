import type { Knex } from 'knex'

const legacyCodeMap: Record<string, string> = {
  Silver: 'legacy_silver',
  Gold: 'legacy_gold',
  Green: 'legacy_green',
  Master: 'legacy_master',
  'Grand Master': 'legacy_grandmaster',
  Ruby: 'legacy_ruby',
  'Curso Aptis': 'legacy_aptis',
  Blue: 'legacy_blue',
  Diamond: 'legacy_diamond',
  Platinum: 'legacy_platinum',
  Go: 'legacy_go',
  'Curso IELTS': 'legacy_ielts'
}

exports.up = async function (knex: Knex): Promise<void> {
  const plans = await knex('plans').whereNull('code').select('id', 'name')

  for (const plan of plans) {
    const baseCode = legacyCodeMap[plan.name]
    if (!baseCode) continue

    const taken = await knex('plans').where({ code: baseCode }).first()
    const finalCode = taken ? `${baseCode}_${plan.id}` : baseCode

    await knex('plans').where({ id: plan.id }).update({ code: finalCode })
  }
}

exports.down = async function (knex: Knex): Promise<void> {
  const bases = Object.values(legacyCodeMap)
  for (const base of bases) {
    await knex('plans')
      .where('code', base)
      .orWhere('code', 'like', `${base}_%`)
      .update({ code: null })
  }
}
