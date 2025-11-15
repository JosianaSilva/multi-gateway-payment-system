import vine from '@vinejs/vine'

export const createUserValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(2).maxLength(100),
    email: vine.string().trim().toLowerCase().email(),
    password: vine.string().minLength(6).maxLength(50),
    role: vine.enum(['user', 'admin']).optional(),
    is_active: vine.boolean().optional(),
  })
)

export const updateUserValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(2).maxLength(100).optional(),
    email: vine.string().trim().toLowerCase().email().optional(),
    password: vine.string().minLength(6).maxLength(50).optional(),
    role: vine.enum(['user', 'admin']).optional(),
    is_active: vine.boolean().optional(),
  })
)

export const loginValidator = vine.compile(
  vine.object({
    email: vine.string().trim().toLowerCase().email(),
    password: vine.string().minLength(1),
  })
)
