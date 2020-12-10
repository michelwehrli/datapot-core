import { Property } from '@mikro-orm/core'

export default class Table implements ITable {
  @Property({ nullable: true })
  _creation_date: number

  @Property({ nullable: true })
  _modification_date: number

  constructor() {}

  async init(data: any) {
    if (!data) {
      data = {}
    }
    this._creation_date = data._creation_date || new Date().getTime()
    this._modification_date = data._modification_date || new Date().getTime()
    return this
  }
}
