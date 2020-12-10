import { NextFunction, Request, Response } from 'express'
import * as jwt from 'jsonwebtoken'

import IUser from '../interface/model/system/IUser'
import User from '../model/system/User'
import DatabaseService from './DatabaseService'

export default class AuthService {
  public static async isAuthenticated(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    let accessToken = req.cookies[process.env.DATAPOT_SESSION_COOKIE_NAME]

    if (!accessToken) {
      res.cookie(process.env.DATAPOT_SESSION_COOKIE_NAME, undefined, {
        expires: new Date(0),
      })
      return res.status(200).send({
        authorized: false,
      })
    }

    try {
      const payload: any = jwt.verify(
        accessToken,
        process.env.DATAPOT_TOKEN_SECRET
      )

      const user: User = await DatabaseService.findOne('system', User, <IUser>{
        id: payload.id,
      })

      const newPayload = { id: user.id }

      let newToken = jwt.sign(newPayload, process.env.DATAPOT_TOKEN_SECRET, {
        algorithm: 'HS256',
        expiresIn: `${process.env.DATAPOT_TOKEN_LIFE}s`,
      })
      user.refresh_token = newToken

      await DatabaseService.insert('system', [user])

      res.cookie(process.env.DATAPOT_SESSION_COOKIE_NAME, newToken, {
        secure: true,
        httpOnly: true,
      })

      next()
    } catch (exc) {
      console.error(exc.message)
      res.cookie(process.env.DATAPOT_SESSION_COOKIE_NAME, undefined, {
        expires: new Date(0),
      })
      return res.status(200).send({
        authorized: false,
      })
    }
  }

  public static async authCheck(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    let accessToken = req.cookies[process.env.DATAPOT_SESSION_COOKIE_NAME]

    if (!accessToken) {
      res.cookie(process.env.DATAPOT_SESSION_COOKIE_NAME, undefined, {
        expires: new Date(0),
      })
      return res.status(200).send({
        authorized: false,
      })
    }

    try {
      jwt.verify(accessToken, process.env.DATAPOT_TOKEN_SECRET)
      next()
    } catch (exc) {
      res.cookie(process.env.DATAPOT_SESSION_COOKIE_NAME, undefined, {
        expires: new Date(0),
      })
      return res.status(200).send({
        authorized: false,
      })
    }
  }
}
