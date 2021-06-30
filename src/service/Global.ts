import DatabaseService from './DatabaseService'

export default class Global {
  public static async getCollection<T>(
    arr: any[],
    id: string,
    entity: any
  ): Promise<T[]> {
    const ret: T[] = []
    for (const entry of arr) {
      const where = {}
      where[id] = entry[id]
      let obj = await DatabaseService.findOne<T>('data', entity, where)
      if (!obj) {
        obj = (await new (entity as any)().create(entry)) as T
      } else {
        obj = await (obj as any).create(entry)
      }
      ret.push(obj)
    }
    return ret
  }
}
