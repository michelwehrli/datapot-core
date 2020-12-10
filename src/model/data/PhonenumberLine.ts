import { Entity, PrimaryKey, Property } from '@mikro-orm/core'
import IPhonenumberLine from '../../interface/model/data/IPhonenumberLine'
import Table from '../extends/Table'

@Entity()
export default class PhonenumberLine extends Table implements IPhonenumberLine {
  @PrimaryKey()
  uniquename: string

  @Property()
  label: string

  constructor() {
    super()
  }

  async init(data: IPhonenumberLine) {
    if (!data) {
      data = {}
    }
    this.uniquename = data.uniquename
    this.label = data.label
    return this
  }

  public static getDatamodel() {
    return {
      __meta: {
        db: 'data',
        name: 'phonenumber_line',
        title: 'Telefon-Methode',
        titlePlural: 'Telefon-Methoden',
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
    }
  }
}
