import express from 'express'

export const blogService = {
  async blogs(req: express.Request, res: express.Response) {
    return res.json({ message: 'Blogs' })
  }
}
