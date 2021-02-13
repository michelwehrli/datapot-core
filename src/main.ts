import * as bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import * as dotenv from 'dotenv'
import express, { NextFunction, Request, Response } from 'express'
import * as fs from 'fs'
import helmet from 'helmet'
import * as https from 'https'

import Logger from './service/Logger'
import Router from './service/Router'

try {
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
      origin: 'https://new-crm.datapot.ch',
      credentials: true,
    })
  )
  app.use((_req: Request, res: Response, next: NextFunction) => {
    res.header('Access-Control-Allow-Origin', 'https://new-crm.datapot.ch')
    res.header(
      'Access-Control-Allow-Methods',
      'GET, POST, PATCH, PUT, DELETE, OPTIONS'
    )
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, Content-Type, X-Auth-Token'
    )
    next()
  })

  Router.listen(app).then(() => {
    https
      .createServer(
        {
          key: fs.readFileSync(
            process.env[`DATAPOT_SSL_KEY_LOCATION_${process.env.DATAPOT_MODE}`],
            'utf-8'
          ),
          cert: fs.readFileSync(
            process.env[
              `DATAPOT_SSL_CERT_LOCATION_${process.env.DATAPOT_MODE}`
            ],
            'utf-8'
          ),
        },
        app
      )
      .listen(process.env.DATAPOT_PORT)
  })
} catch (exc) {
  Logger.log(
    'GLOBAL',
    `${new Date().toLocaleTimeString('de-CH', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })}\t\tERROR -> ${exc.message}`
  )
}
