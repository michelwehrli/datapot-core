import { Property } from '@mikro-orm/core'

export default class Table implements ITable {
  @Property({ nullable: true })
  _creation_date: number

  @Property({ nullable: true })
  _modification_date: number

  @Property({ nullable: true })
  _defaultValue: boolean

  constructor() {}

  async init(data: any) {
    if (!data) {
      data = {}
    }
    this._creation_date = data._creation_date || new Date().getTime()
    this._modification_date = data._modification_date || new Date().getTime()
    this._defaultValue = data._defaultValue || false
    return this
  }

  static getParentDatamodel(): any {
    return {
      _defaultValue: {
        label: 'Standardwert',
        type: 'boolean',
        isListable: false,
      },
    }
  }
}
