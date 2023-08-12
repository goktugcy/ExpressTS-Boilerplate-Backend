import express from 'express'
import { authService } from '../auth/service'

export const createRoutes = async () => {
  const router = express.Router()

  router.get('/login', authService.login)

  return router
}
