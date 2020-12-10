import * as fs from 'fs'
import * as jwt from 'jsonwebtoken'
import * as mime from 'mime-types'
import bcrypt from 'bcrypt'
import { Express } from 'express'

import { MikroORM, RequestContext } from '@mikro-orm/core'
import { Request, Response, NextFunction } from 'express'
import SystemBuilder from '../abstraction/SystemBuilder'
import {
  AllEntities,
  DataEntities,
  ProjectreferenceEntities,
  SystemEntities,
} from '../constants/Entities'
import { ETypeIdentifier } from '../enums/ETypeIdentifier'
import { ETypeMatch } from '../enums/ETypeMatch'
import IUser from '../interface/model/system/IUser'
import User from '../model/system/User'
import AuthService from './AuthService'
import DatabaseService from './DatabaseService'
import DataBuilder from '../abstraction/DataBuilder'

export default class Router {
  static auth = AuthService.isAuthenticated

  static navigationGroups: any = {
    group1: {
      __meta: {
        isGroup: true,
        number: 1,
        sort: 1,
        title: 'Kontakte',
      },
    },
    group4: {
      __meta: {
        isGroup: true,
        number: 4,
        sort: 2,
        title: 'Projektreferenzen',
      },
    },
    group2: {
      __meta: {
        isGroup: true,
        number: 2,
        sort: 3,
        title: 'Stammdaten',
      },
    },
    group3: {
      __meta: {
        isGroup: true,
        number: 3,
        sort: 4,
        title: 'Management',
      },
    },
  }

  public static async listen(app: Express) {
    // fs.unlinkSync('../../databases/datapot.db')

    let dataExists = true
    try {
      dataExists = fs.existsSync('../../databases/data.db')
    } catch (exc) {}

    const dataOrm = await MikroORM.init({
      type: 'sqlite',
      dbName: '../../databases/data.db',
      entities: AllEntities,
      contextName: 'data',
    })
    await DatabaseService.setOrm('data', dataOrm)

    if (!dataExists) {
      await DatabaseService.createSchema('data')
      await new DataBuilder().init()
      await new SystemBuilder().init()
    }

    app.use((req: Request, res: Response, next: NextFunction) => {
      RequestContext.create([dataOrm.em], next)
    })

    /*
      get complete datamodel, datamodel of database, 
      datamodel of table or datamodel of field
    */
    app.get(
      '/api/:key/datamodel/:database?/:table?/:field?',
      this.auth,
      (req: Request, res: Response, next: NextFunction) => {
        let result: IRestError | IRestSuccess

        try {
          if (req.params.table) {
            let data = ETypeMatch[req.params.table].getDatamodel()
            if (req.params.field) {
              data = data[req.params.field]
            }
            result = {
              success: true,
              authorized: true,
              data: data,
            }
          } else {
            const models = {}
            Object.keys(ETypeMatch).forEach((tableName) => {
              const table = ETypeMatch[tableName]
              models[tableName] = table.getDatamodel()
            })
            result = {
              success: true,
              authorized: true,
              data: Object.assign(this.navigationGroups, models),
            }
          }
        } catch (exc) {
          result = {
            success: false,
            authorized: true,
            errorCode: 3,
            errorMessage: exc.message,
          }
          return res.status(401).send(result).end()
        }

        res.status(200).send(result).end()
      }
    )

    /*
      get document
    */
    app.get(
      '/document/:dir/:file',
      (req: Request, res: Response, next: NextFunction) => {
        const file = fs.readFileSync(
          `../../build/files/__fullsize/${req.params.dir}/${req.params.file}`
        )
        if (mime.lookup(req.params.dir)) {
          res.setHeader('Content-Type', <string>mime.lookup(req.params.dir))
        }
        res.end(file)
      }
    )
    app.get(
      '/thumbnail/:dir/:file',
      (req: Request, res: Response, next: NextFunction) => {
        const file = fs.readFileSync(
          `../../build/files/__thumbnail/${req.params.dir}/${req.params.file}`
        )
        if (mime.lookup(req.params.dir)) {
          res.setHeader('Content-Type', <string>mime.lookup(req.params.dir))
        }
        res.end(file)
      }
    )

    /*
      get entry with id or get all entries
    */
    app.get(
      '/api/:key/data/:database/:table/:identifier?',
      this.auth,
      async (req: Request, res: Response, next: NextFunction) => {
        let result: IRestError | IRestSuccess

        if (!req.params.key || !req.params.table) {
          result = {
            success: false,
            authorized: true,
            errorCode: 1,
            errorMessage: 'parameters are missing',
          }
          res.status(401).send(result).end()
        }

        try {
          let where: any
          if (req.params.identifier) {
            where = {}
            where[ETypeIdentifier[req.params.table]] = req.params.identifier
          }
          let method = 'find'
          if (req.params.identifier) {
            method = 'findOne'
          }
          const dbresult: any = await DatabaseService[method](
            req.params.database,
            ETypeMatch[req.params.table],
            where
          )

          const secureFields = []
          Object.keys(ETypeMatch[req.params.table].getDatamodel()).forEach(
            (fieldName) => {
              if (fieldName === '__meta') {
                return
              }
              if (
                ETypeMatch[req.params.table].getDatamodel()[fieldName].isSecure
              ) {
                secureFields.push(fieldName)
              }
            }
          )
          if (secureFields) {
            if (dbresult.forEach) {
              dbresult.forEach((entry) => {
                secureFields.forEach((secureField) => {
                  delete entry[secureField]
                })
              })
            } else {
              secureFields.forEach((secureField) => {
                delete dbresult[secureField]
              })
            }
          }

          if (dbresult) {
            result = {
              success: true,
              authorized: true,
              data: dbresult,
            }
          } else {
            result = {
              success: true,
              authorized: true,
              data: {},
            }
          }
        } catch (exc) {
          result = {
            success: false,
            authorized: true,
            errorCode: 2,
            errorMessage: exc.message,
          }
          return res.status(401).send(result).end()
        }

        res.status(200).send(result).end()
      }
    )

    /*
      create entry without id
    */
    app.post(
      '/api/:key/data/:database/:table/:identifier?',
      this.auth,
      async (req: Request, res: Response, next: NextFunction) => {
        DataBuilder.clearCache()

        let result: IRestError | IRestSuccess

        let obj
        if (req.params.identifier) {
          let where: any
          if (req.params.identifier) {
            where = {}
            where[ETypeIdentifier[req.params.table]] = req.params.identifier
          }
          obj = await DatabaseService.findOne(
            req.params.database,
            ETypeMatch[req.params.table],
            where
          )
          obj = await obj.init(req.body, true)
        } else {
          obj = await new ETypeMatch[req.params.table]().init(req.body, true)
        }

        try {
          await DatabaseService.insert(req.params.database, obj)
          result = {
            success: true,
            authorized: true,
            data: obj,
          }
        } catch (exc) {
          result = {
            success: false,
            authorized: true,
            errorCode: 20,
            errorMessage: exc.message,
          }
          //console.error(exc.message, exc.stack)
        }
        res.status(200).send(result).end()
      }
    )

    /*
      create entry with id
    */
    app.put(
      '/api/:key/data/:database/:table/:identifier',
      this.auth,
      (req: Request, res: Response, next: NextFunction) => {
        let result: IRestError | IRestSuccess = {
          success: true,
          authorized: true,
          data: 'put',
        }

        res.status(200).send(result).end()
      }
    )

    /*
      update entry with id
    */
    app.patch(
      '/api/:key/data/:database/:table/:identifier',
      this.auth,
      (req: Request, res: Response, next: NextFunction) => {
        let result: IRestError | IRestSuccess = {
          success: true,
          authorized: true,
          data: 'patch',
        }

        res.status(200).send(result).end()
      }
    )

    /*
      delete entry with id
    */
    app.delete(
      '/api/:key/data/:database/:table/:identifier',
      this.auth,
      async (req: Request, res: Response, next: NextFunction) => {
        let result: IRestError | IRestSuccess

        let where: any
        if (req.params.identifier) {
          where = {}
          where[ETypeIdentifier[req.params.table]] = req.params.identifier
        }
        const entity = await DatabaseService.findOne(
          req.params.database,
          ETypeMatch[req.params.table],
          where
        )
        try {
          const removeResult = await DatabaseService.remove(
            req.params.database,
            [entity]
          )
          result = {
            success: true,
            authorized: true,
          }
          res.status(200).send(result).end()
        } catch (exc) {
          result = {
            success: false,
            authorized: true,
            errorCode: 40,
            errorMessage: exc.message,
          }
          res.status(200).send(result).end()
        }
      }
    )

    /*
      login
    */
    app.post(
      '/api/:key/login',
      async (req: Request, res: Response, next: NextFunction) => {
        let success = false
        let authorized = false
        let user: User
        let iuser: IUser = req.body

        if (iuser && iuser.username && iuser.password) {
          user = await DatabaseService.findOne('system', User, {
            username: iuser.username,
          })
          if (user) {
            const valid = bcrypt.compareSync(iuser.password, user.password)
            if (valid) {
              const payload = { id: user.id }

              const token = jwt.sign(
                payload,
                process.env.DATAPOT_TOKEN_SECRET,
                {
                  algorithm: 'HS256',
                  expiresIn: `${process.env.DATAPOT_TOKEN_LIFE}s`,
                }
              )

              user.refresh_token = token
              await DatabaseService.insert('system', [user])

              res.cookie(process.env.DATAPOT_SESSION_COOKIE_NAME, token, {
                secure: true,
                httpOnly: true,
              })
              success = true
              authorized = true
            }
          }
        }

        res.send({
          success: success,
          authorized: authorized,
          user: user,
        })
      }
    )

    app.post(
      '/api/:key/logout',
      async (req: Request, res: Response, next: NextFunction) => {
        res.cookie(process.env.DATAPOT_SESSION_COOKIE_NAME, undefined, {
          expires: new Date(0),
        })
        return res.status(200).send({
          authorized: false,
        })
      }
    )

    app.get(
      '/api/:key/authorized',
      AuthService.authCheck,
      (req: Request, res: Response, next: NextFunction) => {
        res.status(200).send({
          authorized: true,
        })
      }
    )

    /*
      default
    */
    app.all('*', (req: Request, res: Response, next: NextFunction) => {
      let result: IRestError | IRestSuccess = {
        success: false,
        authorized: true,
        errorCode: 0,
        errorMessage: 'not supported',
      }

      res.status(401).send(result).end()
    })
  }
}
