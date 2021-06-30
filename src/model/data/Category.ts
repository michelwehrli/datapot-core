import { Entity } from '@mikro-orm/core'
import ICategory from '../../interface/model/data/ICategory'
import UniquenameLabel from './parents/UniquenameLabel'

@Entity()
export default class Category extends UniquenameLabel implements ICategory {
  constructor() {
    super()
  }

  public static getDatamodel() {
    return Object.assign(super.getDatamodel(), {
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
    })
  }
}
