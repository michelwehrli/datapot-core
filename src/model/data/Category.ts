import { Entity, PrimaryKey, Property } from '@mikro-orm/core'
import ICategory from '../../interface/model/data/ICategory'
import Table from '../extends/Table'

@Entity()
export default class Category extends Table implements ICategory {
  @PrimaryKey()
  uniquename: string

  @Property()
  label: string

  constructor() {
    super()
  }

  async init(data: ICategory) {
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
        name: 'category',
        title: 'Kategorie',
        icon: 'fa fa-tag',
        titlePlural: 'Kategorien',
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
