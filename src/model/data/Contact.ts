import {
  Collection,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core'

import DataImporter from '../../abstraction/DataImporter'
import IContact from '../../interface/model/data/IContact'
import DatabaseService from '../../service/DatabaseService'
import Table from '../extends/Table'
import Address from './Address'
import Category from './Category'
import CompanyWithLocation from './CompanyWithLocation'
import Email from './Email'
import Gender from './Gender'
import Phonenumber from './Phonenumber'
import Relationship from './Relationship'
import RWStatus from './RWStatus'
import Salutation from './Salutation'
import Socialmedia from './Socialmedia'
import Title from './Title'

@Entity()
export default class Contact extends Table implements IContact {
  @PrimaryKey()
  id: number

  @Property({ nullable: true })
  givenname?: string

  @Property({ nullable: true })
  surname?: string

  @ManyToOne(() => Gender, { eager: true })
  gender?: Gender

  @ManyToOne(() => Salutation, { eager: true })
  salutation?: Salutation

  @ManyToOne(() => Title, { eager: true })
  title?: Title

  @Property({ nullable: true })
  additional_names?: string[]

  @ManyToMany(() => Address, null, { eager: true })
  addresses = new Collection<Address>(this)

  @ManyToMany(() => CompanyWithLocation, null, { eager: true })
  companiesWithLocation = new Collection<CompanyWithLocation>(this)

  @Property({ nullable: true })
  department?: string

  @Property({ nullable: true })
  positions?: string[]

  @ManyToMany(() => Phonenumber, null, { eager: true })
  phonenumbers = new Collection<Phonenumber>(this)

  @ManyToMany(() => Email, null, { eager: true })
  emails = new Collection<Email>(this)

  @ManyToOne(() => Contact, { eager: true })
  partner: Contact

  @Property({ nullable: true })
  birthdate?: number

  @Property({ nullable: true })
  websites?: string[]

  @ManyToMany(() => Socialmedia, null, { eager: true })
  social_medias = new Collection<Socialmedia>(this)

  @Property({ nullable: true })
  remarks?: string

  @ManyToOne(() => RWStatus, { eager: true })
  rwstatus?: RWStatus

  @ManyToOne(() => Relationship, { eager: true })
  relationship?: Relationship

  @ManyToMany(() => Category, null, { eager: true })
  categories = new Collection<Category>(this)

  constructor() {
    super()
  }

  async init(data: IContact, clear?: boolean) {
    if (!data) {
      data = {}
    }
    this.id = data.id
    this.givenname = data.givenname
    this.surname = data.surname

    if (data && data.gender && data.gender.uniquename) {
      const existingGender: Gender = await DatabaseService.findOne(
        'data',
        Gender,
        {
          uniquename: data.gender.uniquename,
        }
      )
      this.gender = existingGender
        ? existingGender
        : await new Gender().init(data.gender)
    }

    if (data && data.salutation && data.salutation.uniquename) {
      const existingSalutation: Salutation = await DatabaseService.findOne(
        'data',
        Salutation,
        {
          uniquename: data.salutation.uniquename,
        }
      )
      this.salutation = existingSalutation
        ? existingSalutation
        : await new Salutation().init(data.salutation)
    }

    if (data && data.title && data.title.uniquename) {
      const existingTitle: Title = await DatabaseService.findOne(
        'data',
        Title,
        {
          uniquename: data.title.uniquename,
        }
      )
      this.title = existingTitle
        ? existingTitle
        : await new Title().init(data.title)
    }

    this.additional_names = data.additional_names

    if (data.addresses) {
      if (clear) {
        this.addresses.removeAll()
      }
      for (const address of data.addresses) {
        let found: Address = DataImporter.getCache(
          'contact/addresses/' + JSON.stringify(address)
        )
        if (!found && address.id) {
          found = await DatabaseService.findOne('data', Address, {
            id: address.id,
          })
        }
        if (!found) {
          found = new Address()
          DataImporter.setCache(
            'contact/addresses/' + JSON.stringify(address),
            found
          )
        }
        found = await found.init(address)
        this.addresses.add(found)
      }
    }

    if (data && data.partner && data.partner.id) {
      const existing: Contact = await DatabaseService.findOne('data', Contact, {
        id: data.partner.id,
      })
      this.partner = existing
        ? existing
        : await new Contact().init(data.partner)
    }

    if (data.companiesWithLocation) {
      if (clear) {
        this.companiesWithLocation.removeAll()
      }
      for (const companyWithLocation of data.companiesWithLocation) {
        let found: CompanyWithLocation = DataImporter.getCache(
          `contact/companieswithlocation/${JSON.stringify(companyWithLocation)}`
        )
        if (!found && companyWithLocation.id) {
          found = await DatabaseService.findOne('data', CompanyWithLocation, {
            id: companyWithLocation.id,
          })
        }
        if (!found) {
          found = new CompanyWithLocation()
          DataImporter.setCache(
            `contact/companieswithlocation/${JSON.stringify(
              companyWithLocation
            )}`,
            found
          )
        }
        found = await found.init(companyWithLocation, clear)
        this.companiesWithLocation.add(found)
      }
    }

    this.department = data.department

    this.positions = data.positions

    if (data.phonenumbers) {
      if (clear) {
        this.phonenumbers.removeAll()
      }
      for (const number of data.phonenumbers) {
        let found: Phonenumber = DataImporter.getCache(
          'contact/phonenumbers/' + JSON.stringify(number)
        )
        if (!found && number.id) {
          found = await DatabaseService.findOne('data', Phonenumber, {
            id: number.id,
          })
        }
        if (!found) {
          found = new Phonenumber()
          DataImporter.setCache(
            'contact/phonenumbers/' + JSON.stringify(number),
            found
          )
        }
        found = await found.init(number)
        this.phonenumbers.add(found)
      }
    }

    if (data.emails) {
      if (clear) {
        this.emails.removeAll()
      }
      for (const email of data.emails) {
        let found: Email = DataImporter.getCache(
          'contact/emails/' + JSON.stringify(email)
        )
        if (!found && email.id) {
          found = await DatabaseService.findOne('data', Email, { id: email.id })
        }
        if (!found) {
          found = new Email()
          DataImporter.setCache(
            'contact/emails/' + JSON.stringify(email),
            found
          )
        }
        found = await found.init(email)
        this.emails.add(found)
      }
    }

    this.birthdate = data.birthdate

    this.websites = data.websites

    if (data.social_medias) {
      if (clear) {
        this.social_medias.removeAll()
      }
      for (const sm of data.social_medias) {
        let found: Socialmedia = DataImporter.getCache(
          'contact/social_medias/' + JSON.stringify(sm)
        )
        if (!found && sm.id) {
          found = await DatabaseService.findOne('data', Socialmedia, {
            id: sm.id,
          })
        }
        if (!found) {
          found = new Socialmedia()
          DataImporter.setCache(
            'contact/social_medias/' + JSON.stringify(sm),
            found
          )
        }
        found = await found.init(sm)
        this.social_medias.add(found)
      }
    }

    this.remarks = data.remarks

    if (data && data.rwstatus && data.rwstatus.uniquename) {
      const existingRWStatus: RWStatus = await DatabaseService.findOne(
        'data',
        RWStatus,
        {
          uniquename: data.rwstatus.uniquename,
        }
      )
      this.rwstatus = existingRWStatus
        ? existingRWStatus
        : await new RWStatus().init(data.rwstatus)
    }

    if (data && data.relationship && data.relationship.uniquename) {
      const existingRelationship: Relationship = await DatabaseService.findOne(
        'data',
        Relationship,
        {
          uniquename: data.relationship.uniquename,
        }
      )
      this.relationship = existingRelationship
        ? existingRelationship
        : await new Relationship().init(data.relationship)
    }

    if (data.categories) {
      if (clear) {
        this.categories.removeAll()
      }
      for (const category of data.categories) {
        let found: Category = DataImporter.getCache(
          'contact/categories/' + JSON.stringify(category)
        )
        if (!found && category.uniquename) {
          found = await DatabaseService.findOne('data', Category, {
            uniquename: category.uniquename,
          })
        }
        if (!found) {
          found = new Category()
          DataImporter.setCache(
            'contact/categories/' + JSON.stringify(category),
            found
          )
        }
        found = await found.init(category)
        this.categories.add(found)
      }
    }
    return this
  }

  public static getDatamodel(alreadyCalled: boolean) {
    if (alreadyCalled) {
      return
    }
    return {
      __meta: {
        db: 'data',
        name: 'contact',
        title: 'Kontakt',
        titlePlural: 'Kontakte',
        icon: 'far fa-address-book',
        isListable: true,
        isMain: true,
        parent: 1,
        sort: 'surname',
      },
      id: {
        label: 'ID',
        type: 'number',
        isEditable: false,
        isListable: false,
      },
      surname: {
        label: 'Nachname',
        type: 'string',
      },
      givenname: {
        label: 'Vorname',
        type: 'string',
      },
      gender: {
        label: 'Geschlecht',
        type: Gender.getDatamodel(),
      },
      salutation: {
        label: 'Anrede',
        type: Salutation.getDatamodel(),
      },
      title: {
        label: 'Titel',
        type: Title.getDatamodel(),
      },
      additional_names: {
        label: 'Weitere Namen',
        multiple: true,
        type: 'string',
      },
      addresses: {
        label: 'Adressen',
        multiple: true,
        type: Address.getDatamodel(),
      },
      companiesWithLocation: {
        label: 'Firmen',
        multiple: true,
        type: CompanyWithLocation.getDatamodel(),
      },
      department: {
        label: 'Abteilung',
        type: 'string',
      },
      positions: {
        label: 'Positionen',
        multiple: true,
        type: 'string',
      },
      partner: {
        label: 'Partner',
        type: Contact.getDatamodel(true),
      },
      phonenumbers: {
        label: 'Telefonnummern',
        multiple: true,
        type: Phonenumber.getDatamodel(),
      },
      emails: {
        label: 'Email-Adressen',
        multiple: true,
        type: Email.getDatamodel(),
      },
      birthdate: {
        label: 'Geburtsdatum',
        type: 'date',
      },
      websites: {
        label: 'Webseiten',
        multiple: true,
        type: 'string',
      },
      social_medias: {
        label: 'Socialmedia',
        multiple: true,
        type: Socialmedia.getDatamodel(),
      },
      remarks: {
        label: 'Bemerkungen',
        type: 'string',
      },
      rwstatus: {
        label: 'RW-Status',
        type: RWStatus.getDatamodel(),
      },
      relationship: {
        label: 'Beziehung',
        type: Relationship.getDatamodel(),
      },
      categories: {
        label: 'Kategorien',
        multiple: true,
        type: Category.getDatamodel(),
      },
    }
  }
}
