import express from 'express'
import { authService } from '../auth/controller'

export const createRoutes = async () => {
  const router = express.Router()

  router.post('/login', authService.login)
  router.post('/register', authService.register)

  return router
}
