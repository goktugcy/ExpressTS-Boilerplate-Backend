import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

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
}
