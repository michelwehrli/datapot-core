import { Entity, PrimaryKey, Property, ManyToOne } from '@mikro-orm/core'
import DataImporter from '../../abstraction/DataImporter'
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
      let existingType: PhonenumberType
      if (data && data.type) {
        existingType = await DatabaseService.findOne('data', PhonenumberType, {
          uniquename: data.type.uniquename,
        })
      }
      this.type = existingType
        ? existingType
        : DataImporter.getCache('phonenumber/type/' + JSON.stringify(data.type))
        ? DataImporter.getCache('phonenumber/type/' + JSON.stringify(data.type))
        : await new PhonenumberType().init(data.type)
      DataImporter.setCache(
        'phonenumber/type/' + JSON.stringify(data.type),
        this.type
      )
    }

    if (data && data.line && data.line.uniquename) {
      let existingLine: PhonenumberLine
      if (data && data.line) {
        existingLine = await DatabaseService.findOne('data', PhonenumberLine, {
          uniquename: data.line.uniquename,
        })
      }
      this.line = existingLine
        ? existingLine
        : DataImporter.getCache('phonenumber/line/' + JSON.stringify(data.line))
        ? DataImporter.getCache('phonenumber/line/' + JSON.stringify(data.line))
        : await new PhonenumberLine().init(data.line)
      DataImporter.setCache(
        'phonenumber/line/' + JSON.stringify(data.line),
        this.line
      )
    }

    return this
  }

  public toJSON() {
    return <Phonenumber>{
      id: this.id,
      _creation_date: this._creation_date,
      _modification_date: this._modification_date,
      line: this.line,
      number: this.number,
      type: this.type,
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
