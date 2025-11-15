import Product from '#models/product'
import { HttpContext } from '@adonisjs/core/http'
import { createProductValidator, updateProductValidator } from '#validators/product'

export default class ProductsController {
  /**
   * Display a list of products
   */
  async index({ request, response }: HttpContext) {
    try {
      const page = request.input('page', 1)
      const limit = request.input('limit', 10)
      const active = request.input('active')

      const query = Product.query()

      if (active !== undefined) {
        query.where('active', active === 'true')
      }

      const products = await query.paginate(page, limit)

      return response.json({
        success: true,
        data: products,
      })
    } catch (error) {
      return response.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: error.message,
      })
    }
  }

  /**
   * Create a new product
   */
  async store({ request, response }: HttpContext) {
    try {
      const payload = await request.validateUsing(createProductValidator)

      const product = await Product.create(payload)

      return response.status(201).json({
        success: true,
        message: 'Produto criado com sucesso',
        data: product,
      })
    } catch (error) {
      if (error.messages) {
        return response.status(422).json({
          success: false,
          message: 'Dados inválidos',
          errors: error.messages,
        })
      }

      return response.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: error.message,
      })
    }
  }

  /**
   * Show a specific product
   */
  async show({ params, response }: HttpContext) {
    try {
      const product = await Product.findOrFail(params.id)

      return response.json({
        success: true,
        data: product,
      })
    } catch (error) {
      return response.status(404).json({
        success: false,
        message: 'Produto não encontrado',
      })
    }
  }

  /**
   * Update a product
   */
  async update({ params, request, response }: HttpContext) {
    try {
      const product = await Product.findOrFail(params.id)
      const payload = await request.validateUsing(updateProductValidator)

      product.merge(payload)
      await product.save()

      return response.json({
        success: true,
        message: 'Produto atualizado com sucesso',
        data: product,
      })
    } catch (error) {
      if (error.status === 404) {
        return response.status(404).json({
          success: false,
          message: 'Produto não encontrado',
        })
      }

      if (error.messages) {
        return response.status(422).json({
          success: false,
          message: 'Dados inválidos',
          errors: error.messages,
        })
      }

      return response.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: error.message,
      })
    }
  }

  /**
   * Delete a product
   */
  async destroy({ params, response }: HttpContext) {
    try {
      const product = await Product.findOrFail(params.id)
      await product.delete()

      return response.json({
        success: true,
        message: 'Produto removido com sucesso',
      })
    } catch (error) {
      if (error.status === 404) {
        return response.status(404).json({
          success: false,
          message: 'Produto não encontrado',
        })
      }

      return response.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: error.message,
      })
    }
  }

  /**
   * Toggle product active status
   */
  async toggleActive({ params, response }: HttpContext) {
    try {
      const product = await Product.findOrFail(params.id)
      product.active = !product.active
      await product.save()

      return response.json({
        success: true,
        message: `Produto ${product.active ? 'ativado' : 'desativado'} com sucesso`,
        data: product,
      })
    } catch (error) {
      if (error.status === 404) {
        return response.status(404).json({
          success: false,
          message: 'Produto não encontrado',
        })
      }

      return response.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: error.message,
      })
    }
  }
}
