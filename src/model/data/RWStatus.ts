import { Entity, PrimaryKey, Property } from '@mikro-orm/core'
import IRWStatus from '../../interface/model/data/IRWStatus'
import Table from '../extends/Table'

@Entity()
export default class RWStatus extends Table implements IRWStatus {
  @PrimaryKey()
  uniquename: string

  @Property()
  label: string

  constructor() {
    super()
  }

  async init(data: IRWStatus) {
    super.init(data)
    if (!data) {
      data = {}
    }
    this.uniquename = data.uniquename
    this.label = data.label
    return this
  }

  public static getDatamodel() {
    return Object.assign(super.getParentDatamodel(), {
      __meta: {
        db: 'data',
        name: 'rwstatus',
        title: 'RW-Status',
        titlePlural: 'RW-Status',
        icon: 'fa fa-thermometer-half',
        isListable: true,
        parent: 1,
        sort: 'label',
      },
      uniquename: {
        label: 'Eindeutiger Name',
        type: 'string',
        required: true,
      },
      label: {
        label: 'Bezeichnung',
        type: 'string',
      },
    })
  }
}
