import express from 'express'
import { authService } from '../auth/controller'
import { blogService } from '../blog/controller'
import { authenticateMiddleware } from '../auth/middleware'
import { registerValidation } from '../auth/controller'

export const createRoutes = async () => {
  const router = express.Router()

  router.post('/login', authService.login)
  router.post('/logout', authenticateMiddleware, authService.logout)
  router.post('/register', registerValidation, authService.register)
  router.post('/forgot-password', authService.forgotPassword)
  router.post('/reset-password', authService.resetPassword)

  router.get('/blogs', blogService.blog)
  router.get('/blogs/:id', blogService.show)
  router.post('/blogs', authenticateMiddleware, blogService.create)
  router.put('/blogs/:id', authenticateMiddleware, blogService.update)
  router.delete('/blogs/:id', authenticateMiddleware, blogService.destroy)

  return router
}
