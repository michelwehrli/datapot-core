import 'reflect-metadata'
import { LoadStrategy, MikroORM, wrap } from '@mikro-orm/core'

export default class DatabaseService {
  public static dataOrm: MikroORM
  public static projectreferenceOrm: MikroORM
  public static systemOrm: MikroORM

  public static setOrm(name: string, orm: MikroORM) {
    switch (name) {
      case 'data':
        this.dataOrm = orm
        return
      case 'projectreference':
        this.dataOrm = orm
        return
      case 'system':
        this.dataOrm = orm
        return
    }
  }

  public static async createSchema(name: string): Promise<void> {
    const generator = this.getOrm(name).getSchemaGenerator()
    await generator.createSchema()
  }

  public static async updateSchema(name: string): Promise<void> {
    const generator = this.getOrm(name).getSchemaGenerator()
    await generator.updateSchema()
  }

  public static async insert<T>(name: string, items: T[]): Promise<any> {
    return await this.getOrm(name).em.persistAndFlush(items)
  }

  public static async find<T>(name: string, T, where?: any): Promise<T[]> {
    return await this.getOrm(name).em.find(T, where, {})
  }

  public static async findOne<T>(name: string, T, where: any): Promise<T> {
    const result = await this.getOrm(name).em.findOne(T, where)
    let partnerHandledOnce = false

    async function recursiveInit(obj: any) {
      if (obj) {
        for (const prop of Object.getOwnPropertyNames(obj).filter(
          (prop) => prop !== 'partner' && !partnerHandledOnce
        )) {
          if (prop === 'partner') {
            partnerHandledOnce = true
          }
          if (
            obj[prop] &&
            !Array.isArray(obj[prop]) &&
            typeof obj[prop] === 'object' &&
            wrap(obj[prop])?.init
          ) {
            await wrap(obj[prop]).init()
            await recursiveInit(obj[prop])
          } else if (obj[prop] && obj[prop].forEach) {
            for (const inner of obj[prop]) {
              await recursiveInit(inner)
            }
          } else if (obj[prop] && obj[prop].toArray) {
            for (const inner of obj[prop]) {
              if (wrap(inner)?.init) {
                await wrap(inner).init()
              }
            }
          }
        }
      }
    }
    if (!Array.isArray(result)) {
      await recursiveInit(result)
    } else {
      for (const entry of result) {
        await recursiveInit(entry)
      }
    }

    return result
  }

  public static async remove<T>(name: string, items: T[]): Promise<any> {
    return await this.getOrm(name).em.removeAndFlush(items)
  }

  public static assign<T>(name: string, entity: T, data: any) {
    return this.getOrm(name).em.assign(entity, data)
  }

  public static merge<T>(name: string, entity: T, data: any) {
    return this.getOrm(name).em.merge<T>(entity, data)
  }

  private static getOrm(name: string) {
    switch (name) {
      case 'data':
        return this.dataOrm
      case 'projectreference':
        return this.dataOrm
      case 'system':
        return this.dataOrm
    }
  }
}
