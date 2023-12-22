import mongoose, { Schema } from 'mongoose'

export const userSchema = new Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: Number, required: true }
  },
  { timestamps: true }
)

export const passwordResetSchema = new Schema(
  {
    email: { type: String, required: true },
    token: { type: String, required: true },
    expiration: { type: Date, required: true }
  },
  { timestamps: true }
)

export const sessionSchema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  token: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
})
