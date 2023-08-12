import { Response, Request } from 'express'

export const authService = {
  login: async (req: Request, res: Response) => {
    return res.json({ message: 'Login' })
  }
}
