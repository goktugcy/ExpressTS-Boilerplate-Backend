import express from 'express'
import { authService } from '../auth/controller'
import { blogService } from '../blog/controller'
import { authenticateMiddleware } from '../auth/middleware'
export const createRoutes = async () => {
  const router = express.Router()

  router.post('/login', authService.login)
  router.post('/register', authService.register)

  router.get('/blogs', authenticateMiddleware, blogService.blogs)
  return router
}
