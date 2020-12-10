import {
  Entity,
  PrimaryKey,
  Property,
  ManyToMany,
  Collection,
  ManyToOne,
} from '@mikro-orm/core'
import DataBuilder from '../../abstraction/DataBuilder'
import ICompany from '../../interface/model/data/ICompany'
import DatabaseService from '../../service/DatabaseService'
import Table from '../extends/Table'
import Address from './Address'
import Contact from './Contact'
import Email from './Email'
import Phonenumber from './Phonenumber'

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

  @ManyToOne(() => Contact, { eager: true })
  contact_person?: Contact

  @Property({ nullable: true })
  websites?: string[]

  @Property({ nullable: true })
  remarks?: string

  constructor() {
    super()
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
        let found: Address = DataBuilder.getCache(
          'company/addresses/' + JSON.stringify(address)
        )
        if (!found && address.id) {
          found = await DatabaseService.findOne('data', Address, {
            id: address.id,
          })
        }
        if (!found) {
          found = new Address()
          DataBuilder.setCache(
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
        let found: Email = DataBuilder.getCache(
          'company/emails/' + JSON.stringify(email)
        )
        if (!found && email.id) {
          found = await DatabaseService.findOne('data', Email, {
            id: email.id,
          })
        }
        if (!found) {
          found = new Email()
          DataBuilder.setCache('company/emails/' + JSON.stringify(email), found)
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
        let found: Phonenumber = DataBuilder.getCache(
          'company/phonenumbers/' + JSON.stringify(phonenumber)
        )
        if (!found && phonenumber.id) {
          found = await DatabaseService.findOne('data', Phonenumber, {
            id: phonenumber.id,
          })
        }
        if (!found) {
          found = new Phonenumber()
          DataBuilder.setCache(
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
    }
  }
}
