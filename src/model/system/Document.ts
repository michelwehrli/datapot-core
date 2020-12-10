import { Entity, PrimaryKey, Property } from '@mikro-orm/core'
import * as fs from 'fs'
import * as shell from 'shelljs'
import IDocument from '../../interface/model/system/IDocument'
import Table from '../extends/Table'

const thumb = require('node-thumbnail').thumb

@Entity()
export default class Document extends Table implements IDocument {
  @PrimaryKey()
  id: number

  @Property()
  name: string

  @Property({ nullable: true })
  document?: string

  @Property({ nullable: true })
  issecure?: boolean

  @Property({ nullable: true })
  url?: string

  @Property({ nullable: true })
  previewUrl?: string

  constructor() {
    super()
  }

  async init(data: IDocument) {
    if (!data) {
      data = {}
    }
    this.id = data.id
    this.name = data.name
    this.document = data.document
    this.url = data.url
    this.previewUrl = data.previewUrl
    this.issecure = data.issecure

    this.createFile()

    return this
  }

  private createFile() {
    if (this.document && !this.url) {
      const filetype: string = this.document
        .split('data:')[1]
        .split(';base64,')[0]
        .split('/')[1]
      const base64Image = this.document.split(';base64,').pop()
      const id = '_' + Math.random().toString(36).substr(2, 9)
      const path = `../../build/files/__fullsize/${filetype}`
      const previewPath = `../../build/files/__thumbnail/${filetype}`
      const file = `${id}.${filetype}`
      const previewFile = `${id}_thumb.${filetype}`
      const filePath = `${path}/${file}`
      this.url = `https://core.datapot.ch/document/${filetype}/${file}`
      this.previewUrl = `https://core.datapot.ch/thumbnail/${filetype}/${previewFile}`

      if (!fs.existsSync(path)) {
        shell.mkdir('-p', path)
      }
      if (!fs.existsSync(previewPath)) {
        shell.mkdir('-p', previewPath)
      }
      fs.writeFileSync(filePath, base64Image, { encoding: 'base64' })

      thumb(
        {
          source: filePath,
          destination: previewPath,
          concurrency: 4,
          width: 100,
          quiet: true,
          overwrite: true,
        },
        (files, error) => {}
      )
    }
  }

  public toJSON() {
    return <IDocument>{
      id: this.id,
      name: this.name,
      issecure: this.issecure,
      url: this.url,
      previewUrl: this.previewUrl,
    }
  }

  public static getDatamodel() {
    return {
      __meta: {
        db: 'system',
        name: 'document',
        title: 'Dokument',
        titlePlural: 'Dokumente',
        icon: 'far fa-file',
        isListable: true,
        parent: 3,
        sort: 'name',
      },
      id: {
        label: 'ID',
        type: 'number',
        isEditable: false,
      },
      name: {
        label: 'Name',
        type: 'string',
        required: true,
      },
      document: {
        label: 'Dokument',
        type: 'string',
        isListable: false,
      },
      url: {
        label: 'URL',
        type: 'string',
        isListable: false,
      },
      previewUrl: {
        label: 'Vorschau-URL',
        type: 'string',
        isListable: false,
      },
      issecure: {
        label: 'Ist sicher',
        type: 'boolean',
      },
    }
  }
}
