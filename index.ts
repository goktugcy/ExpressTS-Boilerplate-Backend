import express from 'express'
import dotenv from 'dotenv'
import { createRoutes } from './src/server/routes'

const app = express()
dotenv.config()

const host = process.env.HOST || 'localhost'
const port = process.env.PORT || 5002

const router = createRoutes()

router
  .then((routes) => {
    app.use(routes)
  })
  .catch((err) => {
    console.log(err)
  })

app.get('/', (req, res) => {
  return res.json({ message: 'Hello World' })
})

app.listen(port, () => {
  console.log(`Server ${host}:${port} is running`)
})
