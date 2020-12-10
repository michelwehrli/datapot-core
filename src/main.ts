import * as fs from 'fs'
import * as bodyParser from 'body-parser'
import * as https from 'https'
import * as dotenv from 'dotenv'
import express from 'express'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import cors from 'cors'

import Router from './service/Router'
;(async () => {
  dotenv.config({
    path: '../.env',
  })

  const app = express()
  app.use(helmet())
  app.use(
    bodyParser.urlencoded({
      extended: true,
    })
  )
  app.use(cookieParser())
  app.use(
    bodyParser.json({
      limit: '100mb',
    })
  )
  app.use(
    cors({
      origin: 'https://new-crm.datapot.ch:4000',
      credentials: true,
    })
  )

  await Router.listen(app)

  https
    .createServer(
      {
        key: fs.readFileSync(
          process.env[`DATAPOT_SSL_KEY_LOCATION_${process.env.DATAPOT_MODE}`],
          'utf-8'
        ),
        cert: fs.readFileSync(
          process.env[`DATAPOT_SSL_CERT_LOCATION_${process.env.DATAPOT_MODE}`],
          'utf-8'
        ),
      },
      app
    )
    .listen(process.env.DATAPOT_PORT)
})()
