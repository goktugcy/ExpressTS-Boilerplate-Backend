import { Request, Response, NextFunction } from 'express'
import jwt, { JwtPayload } from 'jsonwebtoken'
import dotenv from 'dotenv'
import { Session } from './model'

dotenv.config()

export const authenticateMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1]

  if (!token) {
    return res.status(401).json({ message: 'Token not provided' })
  }

  try {
    const decodedToken = jwt.verify(token, process.env.SECRET_KEY as string) as JwtPayload
    const session = await Session.findOne({ userId: decodedToken.userId, token })

    if (!session) {
      return res.status(401).json({ message: 'Session not found or token mismatch' })
    }

    next()
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      const decodedToken = jwt.decode(token) as JwtPayload
      await Session.deleteOne({ userId: decodedToken.userId, token })
      return res.status(401).json({ message: 'Token expired' })
    } else if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: 'Invalid token' })
    }

    return res.status(401).json({ message: 'Unauthorized', error })
  }
}

export const getUserId = (req: Request): string | null => {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) return null

  try {
    const decodedToken = jwt.verify(token, process.env.SECRET_KEY as string) as JwtPayload & { userId: string }
    return decodedToken.userId
  } catch (error) {
    // Hata işleme
    return null
  }
}
