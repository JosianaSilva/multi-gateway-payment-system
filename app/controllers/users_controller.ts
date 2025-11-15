import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { createUserValidator, updateUserValidator, loginValidator } from '#validators/user'

export default class UsersController {
  /**
   * Display a list of resource
   */
  async index({ request, response }: HttpContext) {
    try {
      const page = request.input('page', 1)
      const limit = request.input('limit', 10)
      const search = request.input('search', '')
      const isActive = request.input('is_active')

      let query = User.query()

      if (search) {
        query = query.where((builder) => {
          builder.where('name', 'like', `%${search}%`).orWhere('email', 'like', `%${search}%`)
        })
      }

      if (isActive !== undefined) {
        query = query.where('is_active', isActive === 'true')
      }

      const users = await query.orderBy('created_at', 'desc').paginate(page, limit)

      return response.ok({
        message: 'Users retrieved successfully',
        data: users,
      })
    } catch (error) {
      return response.badRequest({
        message: 'Failed to retrieve users',
        error: error.message,
      })
    }
  }

  /**
   * Handle form submission for the create action
   */
  async store({ request, response }: HttpContext) {
    try {
      const payload = await request.validateUsing(createUserValidator)

      // Check if email already exists
      const existingUser = await User.findBy('email', payload.email)
      if (existingUser) {
        return response.conflict({
          message: 'Email already exists',
        })
      }

      const user = await User.create(payload)

      return response.created({
        message: 'User created successfully',
        data: user,
      })
    } catch (error) {
      return response.badRequest({
        message: 'Failed to create user',
        error: error.message,
      })
    }
  }

  /**
   * Show individual record
   */
  async show({ params, response }: HttpContext) {
    try {
      const user = await User.find(params.id)

      if (!user) {
        return response.notFound({
          message: 'User not found',
        })
      }

      return response.ok({
        message: 'User retrieved successfully',
        data: user,
      })
    } catch (error) {
      return response.badRequest({
        message: 'Failed to retrieve user',
        error: error.message,
      })
    }
  }

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request, response }: HttpContext) {
    try {
      const user = await User.find(params.id)

      if (!user) {
        return response.notFound({
          message: 'User not found',
        })
      }

      const payload = await request.validateUsing(updateUserValidator)

      // Check if email already exists (excluding current user)
      if (payload.email && payload.email !== user.email) {
        const existingUser = await User.findBy('email', payload.email)
        if (existingUser) {
          return response.conflict({
            message: 'Email already exists',
          })
        }
      }

      user.merge(payload)
      await user.save()

      return response.ok({
        message: 'User updated successfully',
        data: user,
      })
    } catch (error) {
      return response.badRequest({
        message: 'Failed to update user',
        error: error.message,
      })
    }
  }

  /**
   * Delete record
   */
  async destroy({ params, response }: HttpContext) {
    try {
      const user = await User.find(params.id)

      if (!user) {
        return response.notFound({
          message: 'User not found',
        })
      }

      await user.delete()

      return response.ok({
        message: 'User deleted successfully',
      })
    } catch (error) {
      return response.badRequest({
        message: 'Failed to delete user',
        error: error.message,
      })
    }
  }

  /**
   * Toggle user active status
   */
  async toggleActive({ params, response }: HttpContext) {
    try {
      const user = await User.find(params.id)

      if (!user) {
        return response.notFound({
          message: 'User not found',
        })
      }

      user.isActive = !user.isActive
      await user.save()

      return response.ok({
        message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`,
        data: user,
      })
    } catch (error) {
      return response.badRequest({
        message: 'Failed to toggle user status',
        error: error.message,
      })
    }
  }

  /**
   * Login user
   */
  async login({ request, response }: HttpContext) {
    try {
      const { email, password } = await request.validateUsing(loginValidator)

      const user = await User.authenticate(email, password)

      if (!user) {
        return response.unauthorized({
          message: 'Invalid credentials or account is inactive',
        })
      }

      return response.ok({
        message: 'Login successful',
        data: {
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            isActive: user.isActive,
          },
        },
      })
    } catch (error) {
      return response.badRequest({
        message: 'Login failed',
        error: error.message,
      })
    }
  }
}
