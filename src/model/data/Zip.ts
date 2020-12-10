import { Entity, PrimaryKey, Property } from '@mikro-orm/core'
import IZip from '../../interface/model/data/IZip'
import Table from '../extends/Table'

@Entity()
export default class Zip extends Table implements IZip {
  @PrimaryKey()
  id: number

  @Property()
  zip: string

  @Property()
  location: string

  constructor() {
    super()
  }

  async init(data: IZip) {
    if (!data) {
      data = {}
    }
    this.id = data.id
    this.zip = data.zip
    this.location = data.location
    return this
  }

  public toJSON() {
    return {
      id: this.id,
      zip: this.zip,
      location: this.location,
    }
  }

  public static getDatamodel() {
    return {
      __meta: {
        db: 'data',
        name: 'zip',
        title: 'Ortschaft',
        titlePlural: 'Ortschaften',
        icon: 'fa fa-thumbtack',
        isListable: true,
        parent: 2,
        sort: 'zip',
      },
      id: {
        label: 'ID',
        type: 'number',
        isEditable: false,
        isListable: false,
      },
      zip: {
        label: 'Postleitzahl',
        type: 'string',
        required: true,
      },
      location: {
        label: 'Ort',
        type: 'string',
        required: true,
      },
    }
  }
}
