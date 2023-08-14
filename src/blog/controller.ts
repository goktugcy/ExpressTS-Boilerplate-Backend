import { RequestHandler } from 'express'
import Blog from './model'
import mongoose from 'mongoose'

interface IBlogService {
  blog: RequestHandler
  show: RequestHandler
  create: RequestHandler
  update: RequestHandler
  destroy: RequestHandler
}

class BlogService implements IBlogService {
  blog: RequestHandler = async (req, res) => {
    const blogs = await Blog.find().sort({ createdAt: -1 })
    return res.json(blogs)
  }

  show: RequestHandler = async (req, res) => {
    try {
      const blogId = req.params.id

      if (!mongoose.isValidObjectId(blogId)) {
        return res.status(400).json({ message: 'Invalid blog ID' })
      }

      const blog = await Blog.findById(blogId)

      if (!blog) {
        return res.status(404).json({ message: 'Blog not found' })
      }

      return res.json(blog)
    } catch (error) {
      console.error('Error showing blog:', error)
      return res.status(500).json({ message: 'Something went wrong', error })
    }
  }

  create: RequestHandler = async (req, res) => {
    const { title, description, content } = req.body
    try {
      const existingBlog = await Blog.findOne({ title })

      if (existingBlog) {
        return res.status(400).json({ message: 'A blog with the same title already exists' })
      }

      const newBlog = new Blog({
        title,
        description,
        content
      })

      await newBlog.save()

      return res.json({ message: 'Blog successfully created', createdBlog: newBlog })
    } catch (error) {
      console.error('Error creating blog:', error)
      return res.status(500).json({ message: 'Something went wrong', error })
    }
  }

  update: RequestHandler = async (req, res) => {
    const blogId = req.params.id
    const { title, description, content } = req.body

    try {
      if (!mongoose.isValidObjectId(blogId)) {
        return res.status(400).json({ message: 'Invalid blog ID' })
      }

      const blog = await Blog.findByIdAndUpdate(blogId, { title, description, content }, { new: true })

      if (!blog) {
        return res.status(404).json({ message: 'Blog not found' })
      }

      return res.json({ message: 'Blog successfully updated', updatedBlog: blog })
    } catch (error) {
      console.error('Error updating blog:', error)
      return res.status(500).json({ message: 'Something went wrong', error })
    }
  }

  destroy: RequestHandler = async (req, res) => {
    const blogId = req.params.id

    try {
      if (!mongoose.isValidObjectId(blogId)) {
        return res.status(400).json({ message: 'Invalid blog ID' })
      }

      const blog = await Blog.findByIdAndDelete(blogId)

      if (!blog) {
        return res.status(404).json({ message: 'Blog not found' })
      }

      return res.json({ message: 'Blog successfully deleted', deletedBlog: blog })
    } catch (error) {
      console.error('Error deleting blog:', error)
      return res.status(500).json({ message: 'Something went wrong', error })
    }
  }
}

export const blogService = new BlogService()
