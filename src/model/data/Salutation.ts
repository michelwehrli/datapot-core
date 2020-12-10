import { Entity, PrimaryKey, Property } from '@mikro-orm/core'
import ISalutation from '../../interface/model/data/ISalutation'
import Table from '../extends/Table'

@Entity()
export default class Salutation extends Table implements ISalutation {
  @PrimaryKey()
  uniquename: string

  @Property()
  label: string

  constructor() {
    super()
  }

  async init(data: ISalutation) {
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
        name: 'salutation',
        title: 'Anrede',
        titlePlural: 'Anreden',
        icon: 'far fa-handshake',
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
