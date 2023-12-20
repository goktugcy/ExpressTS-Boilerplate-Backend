import mongoose from 'mongoose'
import { userSchema, passwordResetSchema } from './schema'

const User = mongoose.model('User', userSchema)
const PasswordReset = mongoose.model('PasswordReset', passwordResetSchema)

export { User, PasswordReset }
