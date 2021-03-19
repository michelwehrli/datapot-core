import md5 from 'md5'

import Category from '../model/data/Category'
import Company from '../model/data/Company'
import Contact from '../model/data/Contact'
import Email from '../model/data/Email'
import Phonenumber from '../model/data/Phonenumber'
import Task from '../model/internal/Task'
import User from '../model/system/User'
import {
  graph_deleteContact,
  graph_getContacts,
  graph_getOAuth,
  graph_saveContact,
} from '../o365/graph'
import DatabaseService from '../service/DatabaseService'
import Logger from '../service/Logger'

export default class O365Exporter {
  private static task: Task
  private static user: User

  private static currentProgress: number

  private static contacts: Contact[]
  private static companies: Company[]

  private static stopped: boolean
  private static externallyStopped: boolean
  private static currentContactLookup: Map<string, any> = new Map()

  private static metrics: IMetrics

  public static async start(task: Task, user: User) {
    this.task = task
    this.user = user
    this.contacts = (await (await DatabaseService.find('data', Contact)).filter(
      (contact: Contact) => {
        return contact.gender
          ? contact.gender.uniquename !== 'juristisch'
          : true
      }
    )) as Contact[]
    this.companies = await DatabaseService.find('data', Company)
    this.currentProgress = 0
    this.metrics = {
      skipped: 0,
      added: 0,
      updated: 0,
      deleted: 0,
      errored: 0,
      serverCount: 0,
      o365Count: 0,
    }
    this.externallyStopped = false

    this.task.maxProgress = this.contacts.length + this.companies.length

    const oauthToken = graph_getOAuth().createToken(
      JSON.parse(this.user.o365_oauth_token)
    )
    const newToken = await oauthToken.refresh()

    this.user.o365_oauth_token = JSON.stringify(newToken.token)
    this.user.o365_oaccess_token = newToken.token.access_token
    await DatabaseService.insert('data', [this.user])

    const currentContacts = await graph_getContacts(
      this.user.o365_oaccess_token
    )

    this.currentContactLookup.clear()
    for (const currentContact of currentContacts) {
      if (
        currentContact &&
        currentContact.children &&
        currentContact.children.length &&
        currentContact.children['0']
      ) {
        const syncInfo: ISyncInfo = JSON.parse(currentContact.children['0'])
        delete currentContact.children
        this.currentContactLookup.set(syncInfo.id, {
          hash: syncInfo.hash,
          contact: currentContact,
        })
      } else {
        Logger.log(
          'o365-export',
          `${new Date().toLocaleTimeString('de-CH', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
          })}\t\tERROR -> Could not read syncInfo of "${JSON.stringify(
            currentContact
          )}"`
        )
      }
    }

    this.kick()
  }

  private static async kick() {
    await this.iterateContacts()
    await this.iterateCompanies()

    if (!this.externallyStopped) {
      if (this.currentContactLookup.size) {
        this.task.maxProgress = this.currentContactLookup.size
        this.task.progress = 0

        for (const currentContact of this.currentContactLookup) {
          this.metrics.deleted++
          this.task.progress++
          this.task.setStatusText(
            this.task.progress + '/' + this.task.maxProgress + ' löschen'
          )

          await graph_deleteContact(
            currentContact[1].contact.id,
            this.user.o365_oaccess_token,
            (message: string) => {
              Logger.log(
                'o365-export',
                `${new Date().toLocaleTimeString('de-CH', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                })}\t\tERROR -> ${message}`
              )
            }
          )
        }
      }

      this.task.setStatusText('Räumt auf...')

      const currentContacts = await graph_getContacts(
        this.user.o365_oaccess_token
      )
      this.metrics.serverCount = this.contacts.length + this.companies.length
      this.metrics.o365Count = currentContacts.length
    }

    this.stopped = false
    this.task.stop()
  }

  private static async iterateContacts(index: number = 0) {
    this.task.reportProgress(++this.currentProgress)
    this.task.setStatusText(
      this.task.progress + '/' + this.task.maxProgress + ' exportieren'
    )

    // create o365 contact object
    const c: Contact = this.contacts[index]

    const mobilePhones: string[] = []
    const businessPhones: string[] = []
    const homePhones: string[] = []
    c.phonenumbers.toArray().map((p: Phonenumber) => {
      const isMobile =
        typeof p.line === 'string'
          ? p.line === 'mobile'
          : p.line.uniquename === 'mobile'
      const isBusiness =
        typeof p.type === 'string'
          ? p.type === 'business'
          : p.type.uniquename === 'business'

      if (isMobile) {
        mobilePhones.push(p.number)
      } else {
        if (isBusiness) {
          businessPhones.push(p.number)
        } else {
          homePhones.push(p.number)
        }
      }
    })

    let fileAs = []
    if (c.surname) {
      fileAs.push(c.surname)
    }
    if (c.givenname) {
      fileAs.push(c.givenname)
    }
    if (
      c.companiesWithLocation &&
      c.companiesWithLocation[0] &&
      c.companiesWithLocation[0].company &&
      c.companiesWithLocation[0].company.name
    ) {
      fileAs.push(`(${c.companiesWithLocation[0].company.name})`)
    }

    const o365Contact: IO365Contact = {
      fileAs: fileAs.length ? fileAs.join(' ') : '',
      ...(c.birthdate && {
        birthday: O365Exporter.toLocalISOString(new Date(c.birthdate)),
      }),
      ...(c.companiesWithLocation &&
        c.companiesWithLocation.length &&
        c.companiesWithLocation[0] && {
          businessAddress: {
            ...(c.companiesWithLocation[0].address &&
              c.companiesWithLocation[0].address.zip && {
                city: c.companiesWithLocation[0].address.zip.location,
              }),
            ...(c.companiesWithLocation[0].address &&
              c.companiesWithLocation[0].address.country && {
                countryOrRegion:
                  c.companiesWithLocation[0].address.country.label,
              }),
            ...(c.companiesWithLocation[0].address &&
              c.companiesWithLocation[0].address.zip && {
                postalCode: c.companiesWithLocation[0].address.zip.zip,
              }),
            ...(c.companiesWithLocation[0].address &&
              c.companiesWithLocation[0].address.county && {
                state: c.companiesWithLocation[0].address.county.label,
              }),
            ...(c.companiesWithLocation[0].address &&
              c.companiesWithLocation[0].address && {
                street: c.companiesWithLocation[0].address.street,
              }),
          },
        }),
      ...(c.websites &&
        c.websites.length > 0 && { businessHomepage: c.websites[0] }),
      ...(businessPhones &&
        businessPhones.length > 0 && {
          businessPhones: businessPhones,
        }),
      ...(c.categories &&
        c.categories.length > 0 && {
          categories: (c.categories.toArray() as Category[]).map((cat) => {
            return cat.label
          }),
        }),
      ...(c.companiesWithLocation &&
        c.companiesWithLocation.length > 0 && {
          companyName: c.companiesWithLocation[0].company.name,
        }),
      ...(c.department && { department: c.department }),
      ...(c.emails &&
        c.emails.length > 0 && {
          emailAddresses: (c.emails.toArray() as Email[])
            .slice(0, 2)
            .map((email) => {
              return {
                address: email.address,
              }
            }),
        }),
      givenName: c.givenname || '',
      ...(homePhones &&
        homePhones.length > 0 && {
          homePhones: homePhones.slice(0, 2),
        }),
      ...(c.addresses &&
        c.addresses.length &&
        c.addresses[0] && {
          homeAddress: {
            ...(c.addresses[0].zip && {
              city: c.addresses[0].zip.location,
            }),
            ...(c.addresses[0].country && {
              countryOrRegion: c.addresses[0].country.label,
            }),
            ...(c.addresses[0].zip && {
              postalCode: c.addresses[0].zip.zip,
            }),
            ...(c.addresses[0].county && {
              state: c.addresses[0].county.label,
            }),
            street: c.addresses[0].street,
          },
        }),
      ...(c.positions &&
        c.positions.length > 0 && { jobTitle: c.positions[0] }),
      ...(mobilePhones &&
        mobilePhones.length > 0 && {
          mobilePhone: mobilePhones[0],
        }),
      ...(c.remarks && {
        personalNotes: c.remarks,
      }),
      ...(c.partner && {
        spouseName:
          c.partner.givenname && c.partner.surname
            ? `${c.partner.givenname} ${c.partner.surname}`
            : c.partner.surname,
      }),
      ...(c.surname && {
        surname: c.surname,
      }),
      ...(c.title && {
        title: c.title.label,
      }),
    }

    const currentContact: IContactLookupItem = this.currentContactLookup.get(
      c.id.toString() + '_contact'
    )

    const isNew = !currentContact
    const isChanged =
      currentContact && currentContact.hash !== md5(JSON.stringify(o365Contact))

    if (isNew || isChanged) {
      let removeError = false

      if (isChanged) {
        await graph_deleteContact(
          currentContact.contact.id,
          this.user.o365_oaccess_token,
          (message: string) => {
            removeError = true
            Logger.log(
              'o365-export',
              `${new Date().toLocaleTimeString('de-CH', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
              })}\t\tERROR -> ${message}: ${JSON.stringify(o365Contact)}`
            )
            this.metrics.errored++
          }
        )

        if (!removeError) {
          this.metrics.updated++
        }
      }

      if (isNew) {
        this.metrics.added++
      }

      if (!removeError) {
        o365Contact.children = [
          JSON.stringify(<ISyncInfo>{
            id: c.id + '_contact',
            hash: md5(JSON.stringify(o365Contact)),
          }),
        ]

        await graph_saveContact(
          o365Contact,
          this.user.o365_oaccess_token,
          (message: string) => {
            Logger.log(
              'o365-export',
              `${new Date().toLocaleTimeString('de-CH', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
              })}\t\tERROR -> ${message}: ${JSON.stringify(o365Contact)}`
            )
            this.metrics.errored++
          }
        )
      }
    }

    this.currentContactLookup.delete(c.id.toString() + '_contact')

    if (this.contacts.length - 1 > index && !this.stopped) {
      if (isNew || isChanged) {
        await this.timeout(350)
      } else {
        this.metrics.skipped++
        await this.timeout(0)
      }
      await this.iterateContacts.call(this, ++index)
    } else {
      this.metrics.skipped++
    }
  }

  private static async iterateCompanies(index: number = 0) {
    this.task.reportProgress(++this.currentProgress)
    this.task.setStatusText(
      this.task.progress + '/' + this.task.maxProgress + ' exportieren'
    )

    // create o365 contact object
    const c: Company = this.companies[index]

    const o365Contact: IO365Contact = {
      fileAs: c.name ? c.name : '',
      ...(c.websites &&
        c.websites.length > 0 && { businessHomepage: c.websites[0] }),
      ...(c.phonenumbers &&
        c.phonenumbers.length > 0 && {
          businessPhones: (c.phonenumbers.toArray() as Phonenumber[]).map(
            (p) => {
              return p.number
            }
          ),
        }),
      ...(c.emails &&
        c.emails.length > 0 && {
          emailAddresses: (c.emails.toArray() as Email[])
            .slice(0, 2)
            .map((email) => {
              return {
                address: email.address,
              }
            }),
        }),
      ...(c.name && { companyName: c.name }),
      givenName: '',
      ...(c.addresses &&
        c.addresses.length &&
        c.addresses[0] && {
          businessAddress: {
            ...(c.addresses[0].zip && {
              city: c.addresses[0].zip.location,
            }),
            ...(c.addresses[0].country && {
              countryOrRegion: c.addresses[0].country.label,
            }),
            ...(c.addresses[0].zip && {
              postalCode: c.addresses[0].zip.zip,
            }),
            ...(c.addresses[0].county && {
              state: c.addresses[0].county.label,
            }),
            street: c.addresses[0].street,
          },
        }),
      ...(c.remarks && {
        personalNotes: c.remarks,
      }),
    }

    const currentContact: IContactLookupItem = this.currentContactLookup.get(
      c.id.toString() + '_company'
    )

    const isNew = !currentContact
    const isChanged =
      currentContact && currentContact.hash !== md5(JSON.stringify(o365Contact))

    if (isNew || isChanged) {
      let removeError = false

      if (isChanged) {
        await graph_deleteContact(
          currentContact.contact.id,
          this.user.o365_oaccess_token,
          (message: string) => {
            removeError = true
            Logger.log(
              'o365-export',
              `${new Date().toLocaleTimeString('de-CH', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
              })}\t\tERROR -> ${message}: ${JSON.stringify(o365Contact)}`
            )
            this.metrics.errored++
          }
        )

        if (!removeError) {
          this.metrics.updated++
        }
      }

      if (isNew) {
        this.metrics.added++
      }

      if (!removeError) {
        o365Contact.children = [
          JSON.stringify(<ISyncInfo>{
            id: c.id + '_company',
            hash: md5(JSON.stringify(o365Contact)),
          }),
        ]

        await graph_saveContact(
          o365Contact,
          this.user.o365_oaccess_token,
          (message: string) => {
            Logger.log(
              'o365-export',
              `${new Date().toLocaleTimeString('de-CH', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
              })}\t\tERROR -> ${message}: ${JSON.stringify(o365Contact)}`
            )
            this.metrics.errored++
          }
        )
      }
    }

    this.currentContactLookup.delete(c.id.toString() + '_company')

    if (this.companies.length - 1 > index && !this.stopped) {
      if (isNew || isChanged) {
        await this.timeout(350)
      } else {
        this.metrics.skipped++
        await this.timeout(0)
      }
      await this.iterateCompanies.call(this, ++index)
    } else {
      this.metrics.skipped++
    }
  }

  public static async stop() {
    this.externallyStopped = true
    this.stopped = true
  }

  private static timeout(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  public static getMetrics(): IMetrics {
    return this.metrics
  }

  private static toLocalISOString(date: Date) {
    const off = date.getTimezoneOffset()
    return new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      date.getHours(),
      date.getMinutes() - off,
      date.getSeconds(),
      date.getMilliseconds()
    ).toISOString()
  }
}

interface ISyncInfo {
  id: string
  hash: string
}

interface IContactLookupItem {
  hash: string
  contact: IO365Contact
}

interface IMetrics {
  skipped: number
  added: number
  updated: number
  deleted: number
  errored: number
  serverCount: number
  o365Count: number
}
