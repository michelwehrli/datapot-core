import {
  Entity,
  PrimaryKey,
  Property,
  ManyToMany,
  Collection,
  ManyToOne,
  OneToOne,
} from '@mikro-orm/core'
import DataImporter from '../../abstraction/DataImporter'
import ICompany from '../../interface/model/data/ICompany'
import DatabaseService from '../../service/DatabaseService'
import Table from '../extends/Table'
import Address from './Address'
import Category from './Category'
import Contact from './Contact'
import Email from './Email'
import Phonenumber from './Phonenumber'
import Relationship from './Relationship'
import RWStatus from './RWStatus'

@Entity()
export default class Company extends Table implements ICompany {
  @PrimaryKey()
  id: number

  @Property()
  name: string

  @ManyToMany(() => Address, null, {
    eager: true,
  })
  addresses = new Collection<Address>(this)

  @ManyToMany(() => Email, null, { eager: true })
  emails = new Collection<Email>(this)

  @ManyToMany(() => Phonenumber, null, { eager: true })
  phonenumbers = new Collection<Phonenumber>(this)

  @OneToOne(() => Contact)
  contact_person?: Contact

  @Property({ nullable: true })
  websites?: string[]

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

  public toJSON() {
    this.addresses.init()
    return this
  }

  async init(data: ICompany, clear?: boolean) {
    if (!data) {
      data = {}
    }
    if (data.id) {
      this.id = data.id
    }
    this.name = data.name

    if (data.addresses) {
      if (clear) {
        this.addresses.removeAll()
      }
      for (const address of data.addresses) {
        let found: Address = DataImporter.getCache(
          'company/addresses/' + JSON.stringify(address)
        )
        if (!found && address.id) {
          found = await DatabaseService.findOne('data', Address, {
            id: address.id,
          })
        }
        if (!found) {
          found = new Address()
          DataImporter.setCache(
            'company/addresses/' + JSON.stringify(address),
            found
          )
        }
        found = await found.init(address)
        this.addresses.add(found)
      }
    }

    if (data.emails) {
      if (clear) {
        this.emails.removeAll()
      }
      for (const email of data.emails) {
        let found: Email = DataImporter.getCache(
          'company/emails/' + JSON.stringify(email)
        )
        if (!found && email.id) {
          found = await DatabaseService.findOne('data', Email, {
            id: email.id,
          })
        }
        if (!found) {
          found = new Email()
          DataImporter.setCache(
            'company/emails/' + JSON.stringify(email),
            found
          )
        }
        found = await found.init(email)
        this.emails.add(found)
      }
    }

    if (data.phonenumbers) {
      if (clear) {
        this.phonenumbers.removeAll()
      }
      for (const phonenumber of data.phonenumbers) {
        let found: Phonenumber = DataImporter.getCache(
          'company/phonenumbers/' + JSON.stringify(phonenumber)
        )
        if (!found && phonenumber.id) {
          found = await DatabaseService.findOne('data', Phonenumber, {
            id: phonenumber.id,
          })
        }
        if (!found) {
          found = new Phonenumber()
          DataImporter.setCache(
            'company/phonenumbers/' + JSON.stringify(phonenumber),
            found
          )
        }
        found = await found.init(phonenumber)
        this.phonenumbers.add(found)
      }
    }

    if (data && data.contact_person && data.contact_person.id) {
      const existing: Contact = await DatabaseService.findOne('data', Contact, {
        id: data.contact_person.id,
      })
      this.contact_person = existing
        ? existing
        : await new Contact().init(data.contact_person)
    }

    this.websites = data.websites
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
    } else {
      this.rwstatus = undefined
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
    } else {
      this.relationship = undefined
    }

    if (data.categories) {
      if (clear) {
        this.categories.removeAll()
      }
      for (const category of data.categories) {
        let found: Category = DataImporter.getCache(
          'company/categories/' + JSON.stringify(category)
        )
        if (!found && category.uniquename) {
          found = await DatabaseService.findOne('data', Category, {
            uniquename: category.uniquename,
          })
        }
        if (!found) {
          found = new Category()
          DataImporter.setCache(
            'company/categories/' + JSON.stringify(category),
            found
          )
        }
        found = await found.init(category)
        this.categories.add(found)
      }
    }

    return this
  }

  public static getDatamodel() {
    return {
      __meta: {
        db: 'data',
        name: 'company',
        title: 'Firma',
        titlePlural: 'Firmen',
        icon: 'far fa-building',
        isListable: true,
        isMain: true,
        parent: 1,
        sort: 'name',
      },
      id: {
        label: 'ID',
        type: 'number',
        isEditable: false,
        isListable: false,
      },
      name: {
        label: 'Name',
        type: 'string',
        required: true,
      },
      addresses: {
        label: 'Adressen',
        multiple: true,
        type: Address.getDatamodel(),
      },
      emails: {
        label: 'Email-Adressen',
        multiple: true,
        type: Email.getDatamodel(),
      },
      phonenumbers: {
        label: 'Telefonnummern',
        multiple: true,
        type: Phonenumber.getDatamodel(),
      },
      contact_person: {
        label: 'Kontaktperson',
        type: Contact.getDatamodel(true),
      },
      websites: {
        label: 'Webseiten',
        multiple: true,
        type: 'string',
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
