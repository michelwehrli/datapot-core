import {
  Entity,
  LoadStrategy,
  ManyToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core'
import IPhonenumber from '../../interface/model/data/IPhonenumber'
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

  constructor(data: IPhonenumber) {
    super(data)
    this.id = data?.id
    this.number = data?.number
    this.type = (data?.type as PhonenumberType) || null
    this.line = (data?.line as PhonenumberLine) || null
  }

  public async refresh(data: IPhonenumber) {
    this.number = data?.number
    this.type
      ? data?.type?.uniquename && (await this.type.refresh(data.type))
      : (this.type = data?.type?.uniquename
          ? (data.type as PhonenumberType)
          : null)
    this.line
      ? data?.line?.uniquename && (await this.line.refresh(data.line))
      : (this.line = data?.line?.uniquename
          ? (data.line as PhonenumberLine)
          : null)
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
