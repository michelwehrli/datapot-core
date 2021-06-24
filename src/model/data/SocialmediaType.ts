import { Entity } from '@mikro-orm/core'
import ISocialmediaType from '../../interface/model/data/ISocialmediaType'
import UniquenameLabel from './parents/UniquenameLabel'

@Entity()
export default class SocialmediaType extends UniquenameLabel
  implements ISocialmediaType {
  constructor(data: ISocialmediaType) {
    super(data)
  }

  public static getDatamodel() {
    return Object.assign(super.getDatamodel(), {
      __meta: {
        db: 'data',
        name: 'socialmedia_type',
        title: 'Soziale Medien Typ',
        titlePlural: 'Socialmedia-Typen',
        icon: 'far fa-thumbs-up',
        isListable: true,
        parent: 1,
        sort: 'label',
      },
    })
  }
}
