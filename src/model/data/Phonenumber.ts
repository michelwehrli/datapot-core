import { Entity, PrimaryKey, Property, ManyToOne } from '@mikro-orm/core'
import DataBuilder from '../../abstraction/DataBuilder'
import IPhonenumber from '../../interface/model/data/IPhonenumber'
import DatabaseService from '../../service/DatabaseService'
import Table from '../extends/Table'
import PhonenumberLine from './PhonenumberLine'
import PhonenumberType from './PhonenumberType'

@Entity()
export default class Phonenumber extends Table implements IPhonenumber {
  @PrimaryKey()
  id: number

  @Property()
  number: string

  @ManyToOne(() => PhonenumberType, {
    eager: true,
  })
  type: PhonenumberType

  @ManyToOne(() => PhonenumberLine, {
    eager: true,
  })
  line: PhonenumberLine

  constructor() {
    super()
  }

  async init(data: IPhonenumber) {
    if (!data) {
      data = {}
    }
    if (data.id) {
      this.id = data.id
    }
    this.number = data.number

    if (data && data.type && data.type.uniquename) {
      const existingType: PhonenumberType = await DatabaseService.findOne(
        'data',
        PhonenumberType,
        {
          uniquename: data.type.uniquename,
        }
      )
      this.type = existingType
        ? existingType
        : DataBuilder.getCache('phonenumber/type/' + JSON.stringify(data.type))
        ? DataBuilder.getCache('phonenumber/type/' + JSON.stringify(data.type))
        : await new PhonenumberType().init(data.type)
      DataBuilder.setCache(
        'phonenumber/type/' + JSON.stringify(data.type),
        this.type
      )
    }

    if (data && data.line && data.line.uniquename) {
      const existingLine: PhonenumberLine = await DatabaseService.findOne(
        'data',
        PhonenumberLine,
        {
          uniquename: data.line.uniquename,
        }
      )
      this.line = existingLine
        ? existingLine
        : DataBuilder.getCache('phonenumber/line/' + JSON.stringify(data.line))
        ? DataBuilder.getCache('phonenumber/line/' + JSON.stringify(data.line))
        : await new PhonenumberLine().init(data.line)
      DataBuilder.setCache(
        'phonenumber/line/' + JSON.stringify(data.line),
        this.line
      )
    }
    return this
  }

  public toJSON() {
    return <IPhonenumber>{
      id: this.id,
      number: this.number,
      type: this.type,
      line: this.line,
    }
  }

  public static getDatamodel() {
    return {
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
    }
  }
}
