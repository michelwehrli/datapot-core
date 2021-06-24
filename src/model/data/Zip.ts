import { Entity, PrimaryKey, Property } from '@mikro-orm/core'
import IZip from '../../interface/model/data/IZip'
import Table from './parents/Table'

@Entity()
export default class Zip extends Table implements IZip {
  @PrimaryKey()
  id!: number
  @Property()
  zip: string
  @Property()
  location: string

  constructor(data: IZip) {
    super(data)
    this.id = data?.id
    this.zip = data?.zip
    this.location = data?.location
  }

  public async refresh(data: IZip) {
    this.zip = data?.zip
    this.location = data?.location
  }

  public static getDatamodel() {
    return Object.assign(super.getDatamodel(), {
      __meta: {
        db: 'data',
        name: 'zip',
        title: 'Ortschaft',
        titlePlural: 'Ortschaften',
        icon: 'fa fa-thumbtack',
        isListable: true,
        parent: 2,
        sort: 'location',
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
    })
  }
}
