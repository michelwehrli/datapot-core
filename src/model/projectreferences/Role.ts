import { Entity, PrimaryKey, Property } from '@mikro-orm/core'
import IRole from '../../interface/model/projectreferences/IRole'
import Table from '../extends/Table'

@Entity()
export default class Role extends Table implements IRole {
  @PrimaryKey()
  uniquename: string

  @Property()
  label: string

  constructor() {
    super()
  }

  async init(data: IRole) {
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
        name: 'role',
        title: 'Rolle',
        titlePlural: 'Rollen',
        icon: 'fa fa-hat-cowboy',
        isListable: true,
        parent: 4,
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
