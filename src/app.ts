import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import routes from './routes'

export const createApp = (): express.Application => {
  const app = express()

  app.use(
    cors({
      credentials: true,
      origin: ['http://localhost:3000'],
    }),
  )
  app.use(helmet())
  app.use(express.json())
  app.use(
    express.urlencoded({
      extended: true,
    }),
  )

  // API Routes
  app.use('/api', routes)
  app.use('/auth', routes)

  return app
}
