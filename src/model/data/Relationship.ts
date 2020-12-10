import { Entity, PrimaryKey, Property } from '@mikro-orm/core'
import IRelationship from '../../interface/model/data/IRelationship'
import Table from '../extends/Table'

@Entity()
export default class Relationship extends Table implements IRelationship {
  @PrimaryKey()
  uniquename: string

  @Property()
  label: string

  constructor() {
    super()
  }

  async init(data: IRelationship) {
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
        name: 'relationship',
        title: 'Beziehung',
        titlePlural: 'Beziehungen',
        icon: 'fa fa-arrows-alt-h',
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
