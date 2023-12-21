import mongoose from 'mongoose'
import { userSchema, passwordResetSchema, sessionSchema } from './schema'

const User = mongoose.model('User', userSchema)
const PasswordReset = mongoose.model('password_reset', passwordResetSchema)
const Session = mongoose.model('session', sessionSchema)
export { User, PasswordReset, Session }
