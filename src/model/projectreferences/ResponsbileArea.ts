import { Entity, PrimaryKey, Property } from '@mikro-orm/core'
import IResponsibleArea from '../../interface/model/projectreferences/IResponsibleArea'
import Table from '../extends/Table'

@Entity()
export default class ResponsibleArea extends Table implements IResponsibleArea {
  @PrimaryKey()
  uniquename: string

  @Property()
  label: string

  constructor() {
    super()
  }

  async init(data: IResponsibleArea) {
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
        name: 'responsible_area',
        title: 'Zuständigkeitsbereich',
        titlePlural: 'Zuständigkeitsbereiche',
        icon: 'fa fa-warehouse',
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
