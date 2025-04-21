// ! Don't convert require into import
import * as express from 'express'
import { createApp } from './app'
import { Server, createServer } from 'http'
require('module-alias/register')
const moduleAlias = require('module-alias')
moduleAlias.addAlias('@', __dirname)
require('dotenv').config()

export const startServer = (app: express.Application): Server => {
  const httpServer = createServer(app)

  return httpServer.listen({ port: process.env.PORT || 8302 }, (): void => {
    process.stdout.write(`🚀 Server running on PORT:${process.env.PORT || 8302}`)
  })
}

const app = createApp()
startServer(app)
