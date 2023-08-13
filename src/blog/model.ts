import mongoose, { Document, Schema } from 'mongoose'

interface Blog extends Document {
  title: string
  description: string
  content: string
  createdAt: Date
  updatedAt: Date
}

const blogSchema = new Schema<Blog>(
  {
    title: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    content: { type: String, required: true }
  },
  { timestamps: true }
)

const Blog = mongoose.model<Blog>('Blog', blogSchema)

export default Blog
