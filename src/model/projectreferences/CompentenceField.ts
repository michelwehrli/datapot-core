import { Entity, PrimaryKey, Property } from '@mikro-orm/core'
import ICompetenceField from '../../interface/model/projectreferences/ICompetenceField'
import IIndustry from '../../interface/model/projectreferences/IIndustry'
import Table from '../extends/Table'

@Entity()
export default class CompetenceField extends Table implements ICompetenceField {
  @PrimaryKey()
  uniquename: string

  @Property()
  label: string

  constructor() {
    super()
  }

  async init(data: ICompetenceField) {
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
        name: 'competence_field',
        title: 'Kompetenzfeld',
        titlePlural: 'Kompetenzfeldern',
        icon: 'fa fa-brush',
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
