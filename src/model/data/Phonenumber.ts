import { Phone } from '@microsoft/microsoft-graph-types'
import {
  Entity,
  LoadStrategy,
  ManyToOne,
  PrimaryKey,
  Property,
  wrap,
} from '@mikro-orm/core'
import { Database } from 'sqlite3'
import IPhonenumber from '../../interface/model/data/IPhonenumber'
import DatabaseService from '../../service/DatabaseService'
import Table from './parents/Table'
import PhonenumberLine from './PhonenumberLine'
import PhonenumberType from './PhonenumberType'

@Entity()
export default class Phonenumber extends Table {
  @PrimaryKey()
  id!: number
  @Property()
  number: string
  @ManyToOne(() => PhonenumberType, { eager: true })
  type: PhonenumberType
  @ManyToOne(() => PhonenumberLine, { eager: true })
  line: PhonenumberLine

  constructor() {
    super()
  }

  public async create(data: IPhonenumber): Promise<Phonenumber> {
    this.id = data?.id
    this.number = data?.number

    this.type =
      (data?.type?.uniquename &&
        (await DatabaseService.findOne('data', PhonenumberType, {
          uniquename: data.type.uniquename,
        }))) ||
      (data?.type && (await new PhonenumberType().create(data.type)))
    this.line =
      (data?.line?.uniquename &&
        (await DatabaseService.findOne('data', PhonenumberLine, {
          uniquename: data.line.uniquename,
        }))) ||
      (data?.line && (await new PhonenumberLine().create(data.line)))

    return this
  }

  public static getDatamodel() {
    return Object.assign(super.getDatamodel(), {
      __meta: {
        db: 'data',
        name: 'phonenumber',
        title: 'Telefonnummer',
        titlePlural: 'Telefonnummern',
        isListable: false,
        sort: 'number',
      },
      id: {
        label: 'ID',
        type: 'string',
        isEditable: false,
      },
      number: {
        label: 'Nummer',
        type: 'string',
        required: true,
      },
      type: {
        label: 'Typ',
        type: PhonenumberType.getDatamodel(),
        required: true,
      },
      line: {
        label: 'Methode',
        type: PhonenumberLine.getDatamodel(),
        required: true,
      },
    })
  }
}
