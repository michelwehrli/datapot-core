import { Entity, PrimaryKey, Property, ManyToOne } from '@mikro-orm/core'
import DataImporter from '../../abstraction/DataImporter'
import IEmail from '../../interface/model/data/IEmail'
import DatabaseService from '../../service/DatabaseService'
import Table from '../extends/Table'
import EmailType from './EmailType'

@Entity()
export default class Email extends Table implements IEmail {
  @PrimaryKey()
  id: number

  @Property()
  address: string

  @ManyToOne(() => EmailType, {
    eager: true,
  })
  type: EmailType

  private cache = {}

  constructor() {
    super()
  }

  async init(data: IEmail) {
    if (!data) {
      data = {}
    }
    if (data.id) {
      this.id = data.id
    }
    this.address = data.address

    if (data && data.type && data.type.uniquename) {
      const existingType: EmailType = await DatabaseService.findOne(
        'data',
        EmailType,
        {
          uniquename: data.type.uniquename,
        }
      )
      this.type = existingType
        ? existingType
        : DataImporter.getCache('email/' + JSON.stringify(data.type))
        ? DataImporter.getCache('email/' + JSON.stringify(data.type))
        : await new EmailType().init(data.type)
      DataImporter.setCache('email/' + JSON.stringify(data.type), this.type)
    }
    return this
  }

  public toJSON() {
    return <IEmail>{
      id: this.id,
      address: this.address,
      type: this.type,
    }
  }

  public static getDatamodel() {
    return {
      __meta: {
        db: 'data',
        name: 'email',
        title: 'Email',
        titlePlural: 'Emails',
        isListable: false,
        sort: 'address',
      },
      id: {
        label: 'ID',
        type: 'number',
        isEditable: false,
      },
      address: {
        label: 'Adresse',
        type: 'string',
        required: true,
      },
      type: {
        label: 'Typ',
        type: EmailType.getDatamodel(),
        required: true,
      },
    }
  }
}
