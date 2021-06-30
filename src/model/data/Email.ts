import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core'
import IEmail from '../../interface/model/data/IEmail'
import DatabaseService from '../../service/DatabaseService'
import EmailType from './EmailType'
import Table from './parents/Table'

@Entity()
export default class Email extends Table {
  @PrimaryKey()
  id!: number
  @Property()
  address: string
  @ManyToOne(() => EmailType, { eager: true })
  type: EmailType

  constructor() {
    super()
  }

  public async create(data: IEmail): Promise<Email> {
    this.id = data?.id
    this.address = data?.address
    this.type =
      (data?.type?.uniquename &&
        (await DatabaseService.findOne('data', EmailType, {
          uniquename: data.type.uniquename,
        }))) ||
      (data?.type && (await new EmailType().create(data.type)))

    return this
  }

  public static getDatamodel() {
    return Object.assign(super.getDatamodel(), {
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
    })
  }
}
