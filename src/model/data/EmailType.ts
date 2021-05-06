import { Entity, PrimaryKey, Property } from '@mikro-orm/core'
import IEmailType from '../../interface/model/data/IEmailType'
import Table from '../extends/Table'

@Entity()
export default class EmailType extends Table implements IEmailType {
  @PrimaryKey()
  uniquename: string

  @Property()
  label: string

  constructor() {
    super()
  }

  async init(data: IEmailType) {
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
        name: 'email_type',
        title: 'Emailtyp',
        titlePlural: 'Emailtypen',
        icon: 'far fa-envelope',
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
      _defaultValue: {
        label: 'Standardwert',
        type: 'boolean',
      },
    })
  }
}
