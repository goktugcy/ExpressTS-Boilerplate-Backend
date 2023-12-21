import mongoose from 'mongoose'
import { userSchema, passwordResetSchema } from './schema'

const User = mongoose.model('User', userSchema)
const PasswordReset = mongoose.model('password_reset', passwordResetSchema)

export { User, PasswordReset }
