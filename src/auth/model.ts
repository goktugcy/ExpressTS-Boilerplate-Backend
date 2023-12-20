import mongoose, { Document, Schema } from 'mongoose'

interface User extends Document {
  username: string
  email: string
  password: string
  phone: string
  createdAt: Date
  updatedAt: Date
}

interface Register extends Document {
  username: string
  email: string
  password: string
  phone: string
}

interface PasswordReset extends Document {
  email: string
  token: string
  expiration: Date
}

const userSchema = new Schema<User>(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
  },
  { timestamps: true }
)

const passwordResetSchema = new Schema<PasswordReset>(
  {
    email: { type: String, required: true },
    token: { type: String, required: true },
    expiration: { type: Date, required: true }
  },
  { timestamps: true }
)

const User = mongoose.model<User>('User', userSchema)
const PasswordReset = mongoose.model<PasswordReset>('password_reset', passwordResetSchema)

export { User, PasswordReset, Register }
