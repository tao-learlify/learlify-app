import type { Knex } from 'knex'

exports.up = async function (knex: Knex): Promise<void> {
  // Asegurarse de que el rol User (id: 3) existe
  const roleExists = await knex('roles').where({ id: 3 }).first()
  
  if (!roleExists) {
    await knex('roles').insert([
      { id: 1, name: 'Admin' },
      { id: 2, name: 'Teacher' },
      { id: 3, name: 'User' }
    ])
  }
  
  // Insertar el usuario demo
  const user = {
    id: 0,
    firstName: 'Demo',
    lastName: 'AptisGo',
    email: 'aptisgo@noreply',
    password: '$2b$10$ZRPHs7FcGLuVC88neUxXK.47IUnGuaKRH0qswzNt1e9VMSGSaHb1K',
    roleId: 3,
    imageUrl: null,
    isVerified: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
  return knex('users').insert(user)
}

exports.down = function (knex: Knex): unknown {
  return knex('users').where('email', 'aptisgo@noreply').del()
}
