import { Entity, PrimaryKey, Property } from '@mikro-orm/core'
import IGender from '../../interface/model/data/IGender'
import Table from '../extends/Table'

@Entity()
export default class Gender extends Table implements IGender {
  @PrimaryKey()
  uniquename: string

  @Property()
  label: string

  constructor() {
    super()
  }

  async init(data: IGender) {
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
        name: 'gender',
        title: 'Geschlecht',
        titlePlural: 'Geschlechter',
        icon: 'fa fa-venus-mars',
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
