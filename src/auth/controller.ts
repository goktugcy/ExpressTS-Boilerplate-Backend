import { Response, Request } from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import dotenv from 'dotenv'
import User from './model'

dotenv.config()

const secretKey = process.env.SECRET_KEY as string

export const authService = {
  login: async (req: Request, res: Response) => {
    const { username, password } = req.body
    try {
      const user = await User.findOne({ username })

      if (!user) {
        return res.status(404).json({ message: 'User not found' })
      }

      const passwordMatch = await bcrypt.compare(password, user.password)

      if (!passwordMatch) {
        return res.status(401).json({ message: 'Wrong password' })
      }

      const token = jwt.sign({ userId: user._id }, secretKey, { expiresIn: '1h' })

      res.json({ token })
    } catch (error) {
      res.status(500).json({ message: 'Something went wrong', error })
    }
  },

  register: async (req: Request, res: Response) => {
    const { username, email, password } = req.body

    try {
      const hashedPassword = await bcrypt.hash(password, 10)

      const newUser = new User({
        username,
        email,
        password: hashedPassword
      }) as User
      await newUser.save()

      return res.json({ message: 'User successfully created' })
    } catch (error) {
      console.error('Error creating user:', error)
      return res.status(500).json({ message: 'Something went wrong', error })
    }
  }
}
