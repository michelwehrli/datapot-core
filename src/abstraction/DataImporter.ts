import csv from 'csv-parser'
import * as fs from 'fs'
import ICategory from '../interface/model/data/ICategory'
import IContact from '../interface/model/data/IContact'
import Contact from '../model/data/Contact'
import DatabaseService from '../service/DatabaseService'

const IMPORT_FILE_PATH = '../../res/excel_export_utf8.CSV'

export default class DataImporter {
  constructor() {}

  private static cache = {}

  public static getCache(key: string) {
    return this.cache[key]
  }

  public static setCache(key: string, value: any) {
    this.cache[key] = value
  }

  public static clearCache() {
    this.cache = {}
  }

  public async init(): Promise<void> {
    const results = []
    fs.createReadStream(IMPORT_FILE_PATH, { encoding: 'utf8' })
      .pipe(
        csv({
          separator: ';',
        })
      )
      .on('data', (data) => results.push(data))
      .on('end', async () => {
        for (const dirtyContact of results) {
          for (const key in dirtyContact) {
            dirtyContact[key] = dirtyContact[key].trim()
          }

          const categories: ICategory[] = []
          if (dirtyContact['Kategorien']) {
            dirtyContact['Kategorien'].split(';').forEach((cat) => {
              categories.push({
                uniquename: cat
                  .toLowerCase()
                  .split('.')
                  .join('')
                  .split(' ')
                  .join(''),
                label: cat,
              })
            })
          }

          const obj: IContact = {
            ...(!!dirtyContact['Vorname'] && {
              givenname: dirtyContact['Vorname'],
            }),
            surname: dirtyContact['Nachname'],
            ...(!!dirtyContact['Zweiter Vorname'] && {
              additional_names: [dirtyContact['Zweiter Vorname']],
            }),
            ...(!!dirtyContact['RW-Status'] && {
              rwstatus: {
                uniquename: dirtyContact['RW-Status']
                  .toLowerCase()
                  .split('.')
                  .join('')
                  .split(' ')
                  .join(''),
                label: dirtyContact['RW-Status'],
              },
            }),
            ...(!!dirtyContact['Anrede_3pmw'] && {
              salutation: {
                uniquename: dirtyContact['Anrede_3pmw']
                  .toLowerCase()
                  .split('.')
                  .join('')
                  .split(' ')
                  .join(''),
                label: dirtyContact['Anrede_3pmw'],
              },
            }),
            ...(!!dirtyContact['Beziehung'] && {
              relationship: {
                uniquename: dirtyContact['Beziehung']
                  .toLowerCase()
                  .split('.')
                  .join('')
                  .split(' ')
                  .join(''),
                label: dirtyContact['Beziehung'],
              },
            }),
            ...(!!dirtyContact['Geschlecht'] && {
              gender: {
                uniquename: dirtyContact['Geschlecht']
                  .toLowerCase()
                  .split('.')
                  .join('')
                  .split(' ')
                  .join(''),
                label: dirtyContact['Geschlecht'],
              },
            }),
            ...(!!dirtyContact['Abteilung'] && {
              department: dirtyContact['Abteilung'],
            }),
            ...(!!dirtyContact['Position'] && {
              positions: [dirtyContact['Position']],
            }),
            addresses: [
              ...(!!dirtyContact['Straße privat']
                ? [
                    {
                      street: dirtyContact['Straße privat'],
                      ...(dirtyContact['Postleitzahl privat'] &&
                        dirtyContact['Ort privat'] && {
                          zip: {
                            zip: dirtyContact['Postleitzahl privat'],
                            location: dirtyContact['Ort privat'],
                          },
                        }),
                      ...(dirtyContact['Bundesland/Kanton privat'] && {
                        county: {
                          uniquename: dirtyContact['Bundesland/Kanton privat']
                            .toLowerCase()
                            .split('.')
                            .join('')
                            .split(' ')
                            .join(''),
                          label: dirtyContact['Bundesland/Kanton privat'],
                        },
                      }),
                      ...(dirtyContact['Land/Region privat'] && {
                        country: {
                          uniquename: dirtyContact['Land/Region privat']
                            .toLowerCase()
                            .split('.')
                            .join('')
                            .split(' ')
                            .join(''),
                          label: dirtyContact['Land/Region privat'],
                        },
                      }),
                    },
                  ]
                : []),
            ],
            birthdate: this.convertDate(dirtyContact['Geburtstag']),
            categories: categories.concat([
              ...(dirtyContact['Kategorien 2']
                ? [
                    {
                      uniquename: dirtyContact['Kategorien 2']
                        .toLowerCase()
                        .split('.')
                        .join('')
                        .split(' ')
                        .join(''),
                      label: dirtyContact['Kategorien 2'],
                    },
                  ]
                : []),
              ...(dirtyContact['Kategorien 3']
                ? [
                    {
                      uniquename: dirtyContact['Kategorien 3']
                        .toLowerCase()
                        .split('.')
                        .join('')
                        .split(' ')
                        .join(''),
                      label: dirtyContact['Kategorien 3'],
                    },
                  ]
                : []),
              ...(dirtyContact['Kategorien 4']
                ? [
                    {
                      uniquename: dirtyContact['Kategorien 4']
                        .toLowerCase()
                        .split('.')
                        .join('')
                        .split(' ')
                        .join(''),
                      label: dirtyContact['Kategorien 4'],
                    },
                  ]
                : []),
            ]),
            emails: [
              ...(dirtyContact['E-Mail-Adresse']
                ? [
                    {
                      address: dirtyContact['E-Mail-Adresse'],
                      type: {
                        uniquename: 'private',
                        label: 'Privat',
                      },
                    },
                  ]
                : []),
              ...(dirtyContact['E-Mail 3: Adresse']
                ? [
                    {
                      address: dirtyContact['E-Mail 3: Adresse'],
                      type: {
                        uniquename: 'private',
                        label: 'Privat',
                      },
                    },
                  ]
                : []),
            ],
            phonenumbers: [
              ...(dirtyContact['Telefon geschäftlich']
                ? [
                    {
                      number: dirtyContact['Telefon geschäftlich'],
                      line: {
                        uniquename: 'fixnet',
                        label: 'Festnetz',
                      },
                      type: {
                        uniquename: 'business',
                        label: 'Geschäftlich',
                      },
                    },
                  ]
                : []),
              ...(dirtyContact['Telefon geschäftlich 2']
                ? [
                    {
                      number: dirtyContact['Telefon geschäftlich 2'],
                      line: {
                        uniquename: 'fixnet',
                        label: 'Festnetz',
                      },
                      type: {
                        uniquename: 'business',
                        label: 'Geschäftlich',
                      },
                    },
                  ]
                : []),
              ...(dirtyContact['Telefon (privat)']
                ? [
                    {
                      number: dirtyContact['Telefon (privat)'],
                      line: {
                        uniquename: 'fixnet',
                        label: 'Festnetz',
                      },
                      type: {
                        uniquename: 'private',
                        label: 'Privat',
                      },
                    },
                  ]
                : []),
              ...(dirtyContact['Telefon (privat 2)']
                ? [
                    {
                      number: dirtyContact['Telefon (privat 2)'],
                      line: {
                        uniquename: 'fixnet',
                        label: 'Festnetz',
                      },
                      type: {
                        uniquename: 'private',
                        label: 'Privat',
                      },
                    },
                  ]
                : []),
              ...(dirtyContact['Mobiltelefon']
                ? [
                    {
                      number: dirtyContact['Mobiltelefon'],
                      line: {
                        uniquename: 'mobile',
                        label: 'Mobil',
                      },
                      type: {
                        uniquename: 'private',
                        label: 'Privat',
                      },
                    },
                  ]
                : []),
              ...(dirtyContact['Mobiltelefon 2']
                ? [
                    {
                      number: dirtyContact['Mobiltelefon 2'],
                      line: {
                        uniquename: 'mobile',
                        label: 'Mobil',
                      },
                      type: {
                        uniquename: 'private',
                        label: 'Privat',
                      },
                    },
                  ]
                : []),
            ],
            social_medias: [
              ...(dirtyContact['Benutzer 1']
                ? [
                    {
                      url: dirtyContact['Benutzer 1'],
                      type: {
                        uniquename: 'xing',
                        label: 'Xing',
                      },
                    },
                  ]
                : []),
              ...(dirtyContact['Benutzer 1']
                ? [
                    {
                      url: dirtyContact['Benutzer 2'],
                      type: {
                        uniquename: 'linkedin',
                        label: 'LinkedIn',
                      },
                    },
                  ]
                : []),
            ],
            ...(dirtyContact['Namenszusatz'] && {
              title: {
                uniquename: dirtyContact['Namenszusatz']
                  .toLowerCase()
                  .split('.')
                  .join('')
                  .split(' ')
                  .join(''),
                label: dirtyContact['Namenszusatz'],
              },
            }),
            ...(dirtyContact['Webseite'] && {
              websites: [dirtyContact['Webseite']],
            }),
            ...(dirtyContact['Firma'] && {
              companiesWithLocation: [
                {
                  address: {
                    street: dirtyContact['Strasse geschäftlich'],
                    ...(dirtyContact['Postleitzahl geschäftlich'] &&
                      dirtyContact['Ort geschäftlich'] && {
                        zip: {
                          zip: dirtyContact['Postleitzahl geschäftlich'],
                          location: dirtyContact['Ort geschäftlich'],
                        },
                      }),
                    ...(dirtyContact['Region geschäftlich'] && {
                      county: {
                        uniquename: dirtyContact['Region geschäftlich']
                          .toLowerCase()
                          .split('.')
                          .join('')
                          .split(' ')
                          .join(''),
                        label: dirtyContact['Region geschäftlich'],
                      },
                    }),
                    ...(dirtyContact['Land/Region geschäftlich'] && {
                      country: {
                        uniquename: dirtyContact['Land/Region geschäftlich']
                          .toLowerCase()
                          .split('.')
                          .join('')
                          .split(' ')
                          .join(''),
                        label: dirtyContact['Land/Region geschäftlich'],
                      },
                    }),
                  },
                  company: {
                    name: dirtyContact['Firma'],
                    addresses: [
                      ...(dirtyContact['Strasse geschäftlich']
                        ? [
                            {
                              street: dirtyContact['Strasse geschäftlich'],
                              ...(dirtyContact['Postleitzahl geschäftlich'] &&
                                dirtyContact['Ort geschäftlich'] && {
                                  zip: {
                                    zip:
                                      dirtyContact['Postleitzahl geschäftlich'],
                                    location: dirtyContact['Ort geschäftlich'],
                                  },
                                }),
                              ...(dirtyContact['Region geschäftlich'] && {
                                county: {
                                  uniquename: dirtyContact[
                                    'Region geschäftlich'
                                  ]
                                    .toLowerCase()
                                    .split('.')
                                    .join('')
                                    .split(' ')
                                    .join(''),
                                  label: dirtyContact['Region geschäftlich'],
                                },
                              }),
                              ...(dirtyContact['Land/Region geschäftlich'] && {
                                country: {
                                  uniquename: dirtyContact[
                                    'Land/Region geschäftlich'
                                  ]
                                    .toLowerCase()
                                    .split('.')
                                    .join('')
                                    .split(' ')
                                    .join(''),
                                  label:
                                    dirtyContact['Land/Region geschäftlich'],
                                },
                              }),
                            },
                          ]
                        : []),
                    ],
                    emails: [
                      ...(dirtyContact['E-Mail 2: Adresse']
                        ? [
                            {
                              address: dirtyContact['E-Mail 2: Adresse'],
                              type: {
                                uniquename: 'private',
                                label: 'Privat',
                              },
                            },
                          ]
                        : []),
                    ],
                    phonenumbers: [
                      ...(dirtyContact['Haupttelefon']
                        ? [
                            {
                              number: dirtyContact['Haupttelefon'],
                              line: {
                                uniquename: 'fixnet',
                                label: 'Festnetz',
                              },
                              type: {
                                uniquename: 'business',
                                label: 'Geschäftlich',
                              },
                            },
                          ]
                        : []),
                    ],
                  },
                },
              ],
            }),
          }

          const contact = await new Contact().create(obj)

          if (`${obj.givenname ? `${obj.givenname} ` : ''}${obj.surname}`) {
            DataImporter.setCache(
              `partner ${obj.givenname ? `${obj.givenname} ` : ''}${
                obj.surname
              }`,
              contact
            )
          }
          await DatabaseService.insert('data', [contact])

          DataImporter.setCache(`contact-${contact.id}`, contact)
          dirtyContact.id = contact.id
        }

        // insert partners after all contacts are done
        for (const dirtyContact of results) {
          if (dirtyContact['Partner/in']) {
            const contact: Contact = DataImporter.getCache(
              `contact-${dirtyContact.id}`
            )
            if (contact) {
              const partner: Contact = DataImporter.getCache(
                `partner ${dirtyContact['Partner/in']}`
              )
              if (partner) {
                contact.partner = partner
                await DatabaseService.insert('data', [contact])
              }
            }
          }
        }
      })
  }

  private convertDate(birthdate: string): number {
    if (!birthdate) {
      return
    }
    const day = parseInt(birthdate.split('.')[0])
    const month = parseInt(birthdate.split('.')[1]) - 1
    const year = parseInt(birthdate.split('.')[2])
    if (!day || !month || !year) {
      return
    }
    return new Date(year, month, day).getTime()
  }
}
