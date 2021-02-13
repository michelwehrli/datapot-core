import { MikroORM, RequestContext } from '@mikro-orm/core'
import bcrypt from 'bcrypt'
import { Express } from 'express'
import { NextFunction, Request, Response } from 'express'
import * as fs from 'fs'
import * as jwt from 'jsonwebtoken'
import * as mime from 'mime-types'
import { OIDCStrategy } from 'passport-azure-ad'

import Backupper from '../abstraction/Backupper'
import CSVExporter from '../abstraction/CSVExport'
import DataImporter from '../abstraction/DataImporter'
import O365Exporter from '../abstraction/O365Exporter'
import SystemImporter from '../abstraction/SystemImporter'
import TargetedImporter from '../abstraction/TargetedImporter'
import { AllEntities } from '../constants/Entities'
import { ETypeIdentifier } from '../enums/ETypeIdentifier'
import { ETypeMatch } from '../enums/ETypeMatch'
import IUser from '../interface/model/system/IUser'
import Contact from '../model/data/Contact'
import Task from '../model/internal/Task'
import User from '../model/system/User'
import { graph_setUserForO365, graph_signInComplete } from '../o365/graph'
import AuthService from './AuthService'
import DatabaseService from './DatabaseService'
import Logger from './Logger'
import TaskManager from './TaskManager'

const passport = require('passport')
const expressSession = require('express-session')

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
        superOnly: true,
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
    group5: {
      __meta: {
        isGroup: true,
        number: 5,
        sort: 4,
        title: 'Tools',
        additionalItems: [
          {
            __meta: {
              icon: 'fa fa-binoculars',
              isListable: true,
              name: 'email-reviewer',
              parent: 5,
              title: 'E-Mail Reviewer',
              titlePlural: 'E-Mail Reviewer',
              navigate: 'crm/email-reviewer',
            },
          },
        ],
      },
    },
    group3: {
      __meta: {
        isGroup: true,
        number: 3,
        sort: 100,
        title: 'Management',
        additionalItems: [
          {
            __meta: {
              icon: 'fa fa-cog',
              isListable: true,
              name: 'tasks',
              parent: 3,
              title: 'Task',
              titlePlural: 'Tasks',
              navigate: 'crm/tasks',
            },
          },
        ],
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
      await new DataImporter().init()
      await new SystemImporter().init()
    }

    await new TargetedImporter().init()

    await DatabaseService.updateSchema('data')

    app.use((req: Request, res: Response, next: NextFunction) => {
      RequestContext.create([dataOrm.em], next)
    })

    // O365
    app.use(passport.initialize())
    app.use(passport.session())
    app.use((req: Request, res: Response, next: NextFunction) => {
      if (req.user) {
        res.locals.user = (req.user as any).profile
      }
      next()
    })
    app.use(
      expressSession({
        secret: 'datapot',
        resave: false,
        saveUninitialized: true,
        cookie: { secure: true },
      })
    )

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
        try {
          const file = fs.readFileSync(
            `../../build/files/__fullsize/${req.params.dir}/${req.params.file}`
          )
          if (mime.lookup(req.params.dir)) {
            res.setHeader('Content-Type', <string>mime.lookup(req.params.dir))
          }
          res.end(file)
        } catch (exc) {
          res.status(404).end()
        }
      }
    )
    app.get(
      '/thumbnail/:dir/:file',
      (req: Request, res: Response, next: NextFunction) => {
        try {
          const file = fs.readFileSync(
            `../../build/files/__thumbnail/${req.params.dir}/${req.params.file}`
          )
          if (mime.lookup(req.params.dir)) {
            res.setHeader('Content-Type', <string>mime.lookup(req.params.dir))
          }
          res.end(file)
        } catch (exc) {
          res.status(404).end()
        }
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

          await new ETypeMatch[req.params.table]().init(dbresult, true)

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
          if (secureFields && secureFields.length) {
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
          Logger.log(
            'login',
            `${new Date().toLocaleTimeString('de-CH', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
            })}\t\tERROR -> ${exc.message}`
          )

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

    app.get(
      '/api/:key/special/employees/:companyId',
      this.auth,
      async (req: Request, res: Response, next: NextFunction) => {
        const result = {
          success: true,
          authorized: true,
          data: {},
        }

        const contacts: Contact[] = await DatabaseService.find('data', Contact)

        result.data = contacts.filter((contact) => {
          let match = false
          for (const cwl of contact.companiesWithLocation) {
            if (match || !cwl.company) return
            match = cwl.company.id === parseInt(req.params.companyId)
          }
          return match
        })

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
        DataImporter.clearCache()

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
          console.log(exc.message, exc.stack)
          result = {
            success: false,
            authorized: true,
            errorCode: 20,
            errorMessage: exc.message,
          }
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
          await DatabaseService.remove(req.params.database, [entity])
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

    app.get(
      '/api/:key/task/:name/:action/:filename?',
      this.auth,
      async (req: Request, res: Response, next: NextFunction) => {
        let result: IRestError | IRestSuccess

        if (
          !req.params.action ||
          (req.params.name !== 'office-365-export' &&
            req.params.name !== 'csv-export' &&
            req.params.name !== 'ftp-backup') ||
          (req.params.action !== 'start' &&
            req.params.action !== 'open' &&
            req.params.action !== 'download' &&
            req.params.action !== 'stop' &&
            req.params.action !== 'status' &&
            req.params.action !== 'login')
        ) {
          result = {
            success: false,
            authorized: true,
            errorCode: 50,
            errorMessage: 'action not supported',
          }
          return res.status(200).send(result).end()
        }

        if (req.params.name === 'office-365-export') {
          const task: Task = TaskManager.get('office-365-export')

          if (req.params.action === 'start') {
            task.start()
            await O365Exporter.start(task, res.locals.user)
          }
          if (req.params.action === 'stop') {
            O365Exporter.stop()
          }
          if (req.params.action === 'login') {
            result = {
              success: true,
              authorized: true,
              data: {
                redirectTo: 'https://new-core.datapot.ch/o365/signin',
              },
            }
          }
          if (req.params.action === 'status') {
            if (!(res.locals.user as User).o365_oaccess_token) {
              result = {
                success: false,
                authorized: true,
                errorCode: 51,
                errorMessage: 'not logged in',
              }
            } else {
              const metrics = O365Exporter.getMetrics()
              result = {
                success: true,
                authorized: true,
                data: {
                  running: task.running,
                  progress:
                    Math.min((100 / task.maxProgress) * task.progress, 100) ||
                    0,
                  current: task.progress,
                  max: task.maxProgress,
                  metrics: metrics
                    ? `Der Task "[[title]]" wurde erfolgreich abgeschlossen. Hier die Zusammenfassung:\n\nUnverändert: ${metrics.skipped}\nHinzugefügt: ${metrics.added}\nAktualisiert: ${metrics.updated}\nEntfernt: ${metrics.deleted}\nFehler: ${metrics.errored}\n\nKontakte im Datapot: ${metrics.serverCount}\nKontakte auf Office 365: ${metrics.o365Count}`
                    : '',
                  statusText: task.statusText,
                },
              }
            }
          }
        }
        if (req.params.name === 'ftp-backup') {
          const task: Task = TaskManager.get('ftp-backup')

          if (req.params.action === 'start') {
            task.start()
            await Backupper.start(task, res.locals.user)
          }
          if (req.params.action === 'stop') {
            Backupper.stop()
          }
          if (req.params.action === 'status') {
            result = {
              success: true,
              authorized: true,
              data: {
                running: task.running,
                progress:
                  Math.min((100 / task.maxProgress) * task.progress, 100) || 0,
                current: task.progress,
                max: task.maxProgress,
                metrics: 'Die Datenbank wurde erfolgreich gesichert.',
                statusText: task.statusText,
              },
            }
          }
        }
        if (req.params.name === 'csv-export') {
          if (req.params.action === 'open') {
            result = {
              success: true,
              authorized: true,
              data: {
                url: `https://new-core.datapot.ch/api/123/task/csv-export/download/datapot-kontakte_${new Date().getFullYear()}${(
                  '0' +
                  new Date().getMonth() +
                  1
                ).slice(-2)}${('0' + new Date().getDate()).slice(-2)}${(
                  '0' + new Date().getHours()
                ).slice(-2)}${('0' + new Date().getMinutes()).slice(-2)}${(
                  '0' + new Date().getSeconds()
                ).slice(-2)}.csv`,
              },
            }
          }
        }

        if (req.params.action !== 'download') {
          if (!result) {
            result = {
              success: true,
              authorized: true,
            }
          }
          res.status(200).send(result).end()
        } else {
          res.header('Content-Type', 'text/csv')
          res.charset = 'utf-8'
          res
            .status(200)
            .send(await CSVExporter.getCSV())
            .end()
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
        let error: string
        let iuser: IUser = req.body

        try {
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
              } else {
                user = undefined
                error = 'password invalid'
              }
            } else {
              user = undefined
            }
          }
        } catch (exc) {
          error = exc.message
        }

        res.send({
          success: success,
          authorized: authorized,
          error: error,
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

    /* O365 */
    const users: Map<string, any> = new Map()

    passport.serializeUser((user: any, done) => {
      users.set(user.profile.oid, user)
      done(null, user.profile.oid)
    })
    passport.deserializeUser((id: string, done) => {
      done(null, users.get(id))
    })

    const strategy = new OIDCStrategy(
      {
        identityMetadata: `${process.env.OAUTH_AUTHORITY}${process.env.OAUTH_ID_METADATA}`,
        clientID: process.env.OAUTH_APP_ID,
        responseType: 'code id_token',
        responseMode: 'form_post',
        redirectUrl: process.env.OAUTH_REDIRECT_URI,
        allowHttpForRedirectUrl: true,
        clientSecret: process.env.OAUTH_APP_PASSWORD,
        validateIssuer: false,
        passReqToCallback: false,
        scope: process.env.OAUTH_SCOPES.split(' '),
      },
      graph_signInComplete
    )

    passport.use(strategy)

    app.get(
      '/api/:key/authorized',
      this.auth,
      AuthService.authCheck,
      (req: Request, res: Response, next: NextFunction) => {
        res.status(200).send({
          authorized: true,
        })
      }
    )

    app.get(
      '/o365/signin',
      this.auth,
      (req: Request, res: Response, next: NextFunction) => {
        passport.authenticate('azuread-openidconnect', {
          response: res,
          prompt: 'login',
          failureRedirect: '/',
          failureFlash: true,
          successRedirect: '/',
        })(req, res, next)
      }
    )

    app.post(
      '/o365/auth',
      this.auth,
      (req: Request, res: Response, next: NextFunction) => {
        graph_setUserForO365(res.locals.user, users)
        passport.authenticate('azuread-openidconnect', {
          reponse: res,
          failureRedirect: 'https://new-crm.datapot.ch/crm/export',
          failureFlash: false,
          successRedirect: 'https://new-crm.datapot.ch/crm/export',
        })(req, res, next)
      }
    )

    app.get(
      '/o365/signout',
      (req: Request, res: Response, next: NextFunction) => {
        ;(req as any).session.destroy(() => {
          req.logout()
          res.redirect('/')
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
