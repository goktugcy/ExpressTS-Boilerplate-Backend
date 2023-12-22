import { RequestHandler } from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import dotenv from 'dotenv'
import { User, PasswordReset, Session } from './model'
import nodemailer from 'nodemailer'
import { MongoError } from 'mongodb'
import { body, validationResult } from 'express-validator'
import { getUserId } from './middleware'

dotenv.config()

const secretKey = process.env.SECRET_KEY as string

interface IAuthService {
  login: RequestHandler
  register: RequestHandler
  forgotPassword: RequestHandler
  resetPassword: RequestHandler
}

export const registerValidation = [
  body('username').notEmpty().withMessage('Username is required'),
  body('email').isEmail().withMessage('Email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('phone').isMobilePhone('tr-TR').withMessage('Phone number is required')
]
class AuthService implements IAuthService {
  login: RequestHandler = async (req, res) => {
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
      await Session.findOneAndUpdate({ userId: user._id }, { token }, { upsert: true })
      res.json({ token, user })
    } catch (error) {
      res.status(500).json({ message: 'Something went wrong', error })
    }
  }

  register: RequestHandler = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { username, email, password, phone } = req.body

    try {
      const hashedPassword = await bcrypt.hash(password, 10)
      const newUser = new User({
        username,
        email,
        password: hashedPassword,
        phone
      })

      await newUser.save()
      return res.json({ message: 'User successfully created' })
    } catch (error) {
      if (error instanceof MongoError && error.code === 11000) {
        return res.status(400).json({ message: 'User already registered' })
      }
      console.error('Error creating user:', error)
      return res.status(500).json({ message: 'Something went wrong', error })
    }
  }

  forgotPassword: RequestHandler = async (req, res) => {
    const { email } = req.body

    try {
      const user = await User.findOne({ email })

      if (!user) {
        return res.status(404).json({ message: 'User not found' })
      }

      const resetToken = generateResetToken()

      const passwordReset = new PasswordReset({
        email,
        token: resetToken,
        expiration: new Date(Date.now() + 3600000) // 1 saat
      })

      await passwordReset.save()

      sendPasswordResetEmail(email, resetToken)

      return res.json({ message: 'Password reset email sent' })
    } catch (error) {
      console.error('Error sending password reset email:', error)
      return res.status(500).json({ message: 'Something went wrong', error })
    }
  }

  resetPassword: RequestHandler = async (req, res) => {
    const { email, token, newPassword } = req.body

    try {
      const passwordReset = await PasswordReset.findOne({
        email,
        token,
        expiration: { $gt: new Date() }
      })

      if (!passwordReset) {
        return res.status(400).json({ message: 'Invalid reset token or token expired' })
      }

      const user = await User.findOne({ email })

      if (!user) {
        return res.status(404).json({ message: 'User not found' })
      }

      user.password = await bcrypt.hash(newPassword, 10)

      await user.save()

      await passwordReset.deleteOne()

      await Session.deleteOne({ userId: user._id })

      return res.json({ message: 'Password reset successful' })
    } catch (error) {
      console.error('Error resetting password:', error)
      return res.status(500).json({ message: 'Something went wrong', error })
    }
  }

  logout: RequestHandler = async (req, res) => {
    try {
      const userId = getUserId(req)

      if (!userId) {
        return res.status(401).json({ message: 'User not identified' })
      }

      await Session.deleteOne({ userId })

      res.json({ message: 'Logout successful' })
    } catch (error) {
      console.error('Error logging out:', error)
      return res.status(500).json({ message: 'Something went wrong', error })
    }
  }
}

function generateResetToken() {
  const tokenLength = 40
  const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let token = ''

  for (let i = 0; i < tokenLength; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length)
    token += characters.charAt(randomIndex)
  }

  return token
}

export const authService = new AuthService()

function sendPasswordResetEmail(email: string, resetToken: string) {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  } as nodemailer.TransportOptions)

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'Password Reset',
    text: `Click the following link to reset your password: ${process.env.APP_URL}/reset-password?token=${resetToken}`
  }

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending password reset email:', error)
    } else {
      console.log('Password reset email sent:', info)
    }
  })
}
