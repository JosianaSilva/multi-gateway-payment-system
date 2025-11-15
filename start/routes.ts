/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'

router.get('/', async () => {
  return {
    hello: 'world',
  }
})

// Auth routes
router.post('/api/v1/login', '#controllers/users_controller.login')

// User routes
router
  .group(() => {
    router.get('/users', '#controllers/users_controller.index')
    router.post('/users', '#controllers/users_controller.store')
    router.get('/users/:id', '#controllers/users_controller.show')
    router.put('/users/:id', '#controllers/users_controller.update')
    router.patch('/users/:id', '#controllers/users_controller.update')
    router.delete('/users/:id', '#controllers/users_controller.destroy')
    router.patch('/users/:id/toggle-active', '#controllers/users_controller.toggleActive')
  })
  .prefix('/api/v1')

// Product routes
router
  .group(() => {
    router.get('/products', '#controllers/products_controller.index')
    router.post('/products', '#controllers/products_controller.store')
    router.get('/products/:id', '#controllers/products_controller.show')
    router.put('/products/:id', '#controllers/products_controller.update')
    router.patch('/products/:id', '#controllers/products_controller.update')
    router.delete('/products/:id', '#controllers/products_controller.destroy')
    router.patch('/products/:id/toggle-active', '#controllers/products_controller.toggleActive')
  })
  .prefix('/api/v1')
