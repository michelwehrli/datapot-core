import { Entity, PrimaryKey, Property } from '@mikro-orm/core'
import IPhonenumberType from '../../interface/model/data/IPhonenumberType'
import Table from '../extends/Table'

@Entity()
export default class PhonenumberType extends Table implements IPhonenumberType {
  @PrimaryKey()
  uniquename: string

  @Property()
  label: string

  constructor() {
    super()
  }

  async init(data: IPhonenumberType) {
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
        name: 'phonenumber_type',
        title: 'Telefon-Typ',
        titlePlural: 'Telefon-Typen',
        icon: 'fa fa-mobile-alt',
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
