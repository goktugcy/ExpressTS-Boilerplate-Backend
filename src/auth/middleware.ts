import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import { body } from 'express-validator'

export const authenticateMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1]

  dotenv.config()

  if (!token) {
    return res.status(401).json({ message: 'Token not provided' })
  }

  try {
    const decodedToken = jwt.verify(token, process.env.SECRET_KEY as string)
    req.body.user = decodedToken as string
    next()
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' })
  }

  next()
}

export const registerValidation = [
  body('username').isLength({ min: 3, max: 20 }).withMessage('Username must be between 3 and 20 characters'),
  body('email').isEmail().withMessage('Invalid email address'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('phone').isNumeric().withMessage('Phone number must be numeric')
]
