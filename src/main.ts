import * as bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import * as dotenv from 'dotenv'
import express from 'express'
import * as fs from 'fs'
import helmet from 'helmet'
import * as https from 'https'

import Router from './service/Router'

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

Router.listen(app).then(() => {
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
})
