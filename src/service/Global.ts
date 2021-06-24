import { Collection } from '@mikro-orm/core'
import DatabaseService from './DatabaseService'

export default class Global {
  public static async setFreshCollection<T, U>(
    col: Collection<T>,
    data: any[],
    T,
    identifier: string
  ) {
    col.removeAll()
    col.add(
      ...(await Promise.all(
        (data as U[])
          .filter((data) => !!data)
          .map(async (data) => {
            const where = {}
            where[identifier] = data[identifier]
            let result = await DatabaseService.findOne<T>('data', T, where)
            if (!result) {
              result = new T(data)
            } else {
              await (result as any).refresh(data)
            }
            return result
          })
      ))
    )
  }
}
