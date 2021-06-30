import 'reflect-metadata'
import { LoadStrategy, MikroORM, wrap } from '@mikro-orm/core'
import { isObject } from 'util'
import Contact from '../model/data/Contact'

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

  public static getEm(name: string) {
    return this.getOrm(name).em
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
    return await this.getOrm(name).em.find<T>(T, where, {})
  }

  public static async findOne<T>(name: string, T, where: any): Promise<T> {
    const paths = T && T.getNestedPaths ? T?.getNestedPaths() : []
    return await this.getOrm(name).em.findOne<T>(T, where, paths)
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
