import { Entity, PrimaryKey, Property } from '@mikro-orm/core'
import ITitle from '../../interface/model/data/ITitle'
import Table from '../extends/Table'

@Entity()
export default class Title extends Table implements ITitle {
  @PrimaryKey()
  uniquename: string

  @Property()
  label: string

  constructor() {
    super()
  }

  async init(data: ITitle) {
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
        name: 'title',
        title: 'Titel',
        titlePlural: 'Titel',
        icon: 'fa fa-user-md',
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
