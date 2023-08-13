import express from 'express'
import { authService } from '../auth/controller'
import { blogService } from '../blog/controller'
import { authenticateMiddleware } from '../auth/middleware'

export const createRoutes = async () => {
  const router = express.Router()

  // Auth routes
  router.post('/login', authService.login)
  router.post('/register', authService.register)

  router.get('/blogs', blogService.blog)
  router.get('/blogs/:id', blogService.show)
  router.post('/blogs', authenticateMiddleware, blogService.create)
  router.put('/blogs/:id', authenticateMiddleware, blogService.update)
  router.delete('/blogs/:id', authenticateMiddleware, blogService.destroy)

  return router
}
