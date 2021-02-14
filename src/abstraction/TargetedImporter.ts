import csv from 'csv-parser'
import * as fs from 'fs'
import Company from '../model/data/Company'
import Contact from '../model/data/Contact'
import Email from '../model/data/Email'
import EmailType from '../model/data/EmailType'
import DatabaseService from '../service/DatabaseService'

const IMPORT_FILE_PATH = '../../res/excel_export_utf8.CSV'

export default class TargetedImporter {
  constructor() {}

  public async init(): Promise<void> {
    return

    const typeG = await DatabaseService.findOne<EmailType>('data', EmailType, <
      EmailType
    >{
      uniquename: 'business',
    })
    const typeP = await DatabaseService.findOne<EmailType>('data', EmailType, <
      EmailType
    >{
      uniquename: 'private',
    })

    const endings = []
    endings.push('hispeed.ch')
    endings.push('ziksuhr.ch')
    endings.push('hotmail.com')
    endings.push('swissonline.ch')
    endings.push('sensemail.ch')
    endings.push('lueschers.net')
    endings.push('gmail.com')
    endings.push('bluewin.ch')

    const companies = await DatabaseService.find<Company>('data', Company)
    for (const company of companies) {
      for (const email of company.emails) {
        email.type = typeG

        endings.forEach((ending) => {
          if (email.address.endsWith(ending)) {
            console.log(email.address)
            email.type = typeP
          }
        })
      }
    }

    await DatabaseService.insert('data', companies)
    console.log('companies saved')

    const contacts = await DatabaseService.find<Contact>('data', Contact)
    for (const contact of contacts) {
      for (const email of contact.emails) {
        email.type = typeG

        endings.forEach((ending) => {
          if (email.address.endsWith(ending)) {
            console.log(email.address)
            email.type = typeP
          }
        })
      }
    }

    await DatabaseService.insert('data', contacts)
    console.log('contacts saved')

    return
    const results = []

    let updatedCount = 0
    let totalCount = 0

    fs.createReadStream(IMPORT_FILE_PATH, { encoding: 'utf8' })
      .pipe(
        csv({
          separator: ';',
        })
      )
      .on('data', (data) => results.push(data))
      .on('end', async () => {
        for (const dirtyContact of results.filter((entry) => {
          return entry.Vorname && entry.Nachname && entry.Webseite
        })) {
          totalCount++

          const contacts: Contact[] = await DatabaseService.find(
            'data',
            Contact,
            <Contact>{
              givenname: dirtyContact['Vorname'].trim(),
              surname: dirtyContact['Nachname'].trim(),
            }
          )

          if (dirtyContact['Webseite'] && contacts && contacts.length === 1) {
            if (!contacts[0].websites) {
              contacts[0].websites = []
            }
            if (
              contacts[0]?.websites?.indexOf(
                dirtyContact['Webseite'].trim()
              ) === -1
            ) {
              contacts[0].websites.push(dirtyContact['Webseite'].trim())
              await DatabaseService.insert('data', [contacts[0]])

              updatedCount++
            }

            if (
              contacts[0].companiesWithLocation &&
              contacts[0].companiesWithLocation.toArray().length
            ) {
              for (const i in contacts[0].companiesWithLocation
                .toArray()
                .filter((e) => {
                  return !!e.company
                }) as Company[]) {
                const cwl = contacts[0].companiesWithLocation[i].company
                if (!cwl.websites || !cwl.websites.length) {
                  contacts[0].companiesWithLocation[i].company.websites = []
                }
                if (
                  cwl.websites.indexOf(dirtyContact['Webseite'].trim()) === -1
                ) {
                  contacts[0].companiesWithLocation[i].company.websites.push(
                    dirtyContact['Webseite'].trim()
                  )
                  await DatabaseService.insert('data', [contacts[0]])
                }
              }
            }
          }
        }
      })
  }
}
