import 'dotenv/config'
import express from 'express'
import { Routes } from './routes/index.js'

const host = process.env.HOST
const port = process.env.PORT

const app = express()

app.use(express.json())

new Routes(app)

app.listen(port, () => {
  console.info(`🚀 Express is running at http://${host}:${port}`)
})
