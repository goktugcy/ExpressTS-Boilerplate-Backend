import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

const connectDB = async () => {
  try {
    await mongoose.connect(`${process.env.MONGO_URI}`)
    console.log('MongoDB Connected')
  } catch (error) {
    console.error('Error connecting to MongoDB:', error)
  }
}

export default connectDB
