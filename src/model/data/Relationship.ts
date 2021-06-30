import { Entity } from '@mikro-orm/core'
import IRelationship from '../../interface/model/data/IRelationship'
import UniquenameLabel from './parents/UniquenameLabel'

@Entity()
export default class Relationship extends UniquenameLabel
  implements IRelationship {
  constructor() {
    super()
  }

  public static getDatamodel() {
    return Object.assign(super.getDatamodel(), {
      __meta: {
        db: 'data',
        name: 'relationship',
        title: 'Beziehung',
        titlePlural: 'Beziehungen',
        icon: 'fa fa-arrows-alt-h',
        isListable: true,
        parent: 1,
        sort: 'label',
      },
    })
  }
}
