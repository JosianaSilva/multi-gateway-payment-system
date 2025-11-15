import vine from '@vinejs/vine'

export const createProductValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(2).maxLength(255),
    description: vine.string().trim().optional(),
    price: vine.number().positive().decimal([0, 2]),
    stock: vine.number().min(0).optional(),
    active: vine.boolean().optional(),
  })
)

export const updateProductValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(2).maxLength(255).optional(),
    description: vine.string().trim().optional(),
    price: vine.number().positive().decimal([0, 2]).optional(),
    stock: vine.number().min(0).optional(),
    active: vine.boolean().optional(),
  })
)
