import {
  Collection,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core'
import IProjectreference from '../../interface/model/projectreferences/IProjectreference'
import DatabaseService from '../../service/DatabaseService'
import Company from '../data/Company'
import Contact from '../data/Contact'
import Table from '../extends/Table'
import Document from '../system/Document'
import CompetenceField from './CompentenceField'
import Complexity from './Complexity'
import Industry from './Industry'
import ResponsibleArea from './ResponsbileArea'
import Role from './Role'

@Entity()
export default class Projectreference extends Table
  implements IProjectreference {
  @PrimaryKey()
  id?: number

  @Property({ nullable: true })
  projectname: string

  @Property({ nullable: true })
  content: string

  @Property({ nullable: true })
  teaser: string

  @Property({ nullable: true })
  keywords: string[]

  @Property({ nullable: true })
  targets: string[]

  @ManyToOne(() => Company, {
    eager: true,
  })
  client: Company

  @ManyToOne(() => Contact, {
    eager: true,
  })
  reference_person: Contact

  @Property({ nullable: true })
  start_date: number

  @Property({ nullable: true })
  end_date: number

  @Property({ nullable: true })
  function: string

  @ManyToMany(() => Role, null, {
    eager: true,
  })
  roles = new Collection<Role>(this)

  /*@ManyToMany(() => Employee, null, {
    eager: true,
  })
  involved_employees = new Collection<Employee>(this)

  @ManyToMany(() => Service, null, {
    eager: true,
  })
  services = new Collection<Service>(this)*/

  @Property({ nullable: true })
  load: string

  @ManyToOne(() => Complexity, {
    eager: true,
  })
  complexity: Complexity

  @Property({ nullable: true })
  strategic: string

  @Property({ nullable: true })
  novelty: string

  @Property({ nullable: true })
  complexity_string: string

  @Property({ nullable: true })
  risk: string

  @Property({ nullable: true })
  potential: string

  @Property({ nullable: true })
  budget: string

  @ManyToMany(() => Industry, null, {
    eager: true,
  })
  industries = new Collection<Industry>(this)

  @ManyToMany(() => ResponsibleArea, null, {
    eager: true,
  })
  responsible_areas = new Collection<ResponsibleArea>(this)

  @Property({ nullable: true })
  responsible_areas_text: string

  @ManyToMany(() => CompetenceField, null, {
    eager: true,
  })
  competence_fields = new Collection<CompetenceField>(this)

  @ManyToMany(() => Document, null, {
    eager: true,
  })
  attachements = new Collection<Document>(this)

  @ManyToOne(() => Document, {
    eager: true,
  })
  main_image: Document

  @ManyToMany(() => Document, null, {
    eager: true,
  })
  images = new Collection<Document>(this)

  constructor() {
    super()
  }
  uniquename: string

  async init(data: IProjectreference, clear?: boolean) {
    if (!data) {
      data = {}
    }
    this.id = data.id ? data.id : undefined

    this.projectname = data.projectname ? data.projectname : undefined
    this.uniquename = data.uniquename ? data.uniquename : undefined
    this.content = data.content ? data.content : undefined
    this.teaser = data.teaser ? data.teaser : undefined
    this.keywords = data.keywords ? data.keywords : undefined
    this.targets = data.targets ? data.targets : undefined
    this.start_date = data.start_date ? data.start_date : undefined
    this.end_date = data.end_date ? data.end_date : undefined
    this.function = data.function ? data.function : undefined
    this.load = data.load ? data.load : undefined
    this.strategic = data.strategic ? data.strategic : undefined
    this.novelty = data.novelty ? data.novelty : undefined
    this.complexity_string = data.complexity_string
      ? data.complexity_string
      : undefined
    this.risk = data.risk ? data.risk : undefined
    this.potential = data.potential ? data.potential : undefined
    this.budget = data.budget ? data.budget : undefined
    this.responsible_areas_text = data.responsible_areas_text
      ? data.responsible_areas_text
      : undefined

    if (data && data.client && data.client.id) {
      const existing: Company = await DatabaseService.findOne('data', Company, {
        id: data.client.id,
      })
      this.client = existing ? existing : await new Company().init(data.client)
    }

    if (data && data.reference_person && data.reference_person.id) {
      const existing: Contact = await DatabaseService.findOne('data', Contact, {
        id: data.reference_person.id,
      })
      this.reference_person = existing
        ? existing
        : await new Contact().init(data.reference_person)
    }

    if (data && data.complexity && data.complexity.uniquename) {
      const existing: Complexity = await DatabaseService.findOne(
        'data',
        Complexity,
        {
          uniquename: data.complexity.uniquename,
        }
      )
      this.complexity = existing
        ? existing
        : await new Complexity().init(data.complexity)
    }

    if (data && data.main_image && data.main_image.id) {
      const existing: Document = await DatabaseService.findOne(
        'system',
        Document,
        {
          id: data.main_image.id,
        }
      )
      this.main_image = existing
        ? existing
        : await new Document().init(data.main_image)
    }

    if (data.roles) {
      if (clear) {
        this.roles.removeAll()
      }
      for (const role of data.roles) {
        let found: Role
        if (role.uniquename) {
          found = await DatabaseService.findOne('projectreference', Role, {
            uniquename: role.uniquename,
          })
        }
        if (!found) {
          found = new Role()
        }
        found = await found.init(role)
        this.roles.add(found)
      }
    }

    if (data.industries) {
      if (clear) {
        this.industries.removeAll()
      }
      for (const industry of data.industries) {
        let found: Industry
        if (industry.uniquename) {
          found = await DatabaseService.findOne('projectreference', Industry, {
            uniquename: industry.uniquename,
          })
        }
        if (!found) {
          found = new Industry()
        }
        found = await found.init(industry)
        this.industries.add(found)
      }
    }

    if (data.responsible_areas) {
      if (clear) {
        this.responsible_areas.removeAll()
      }
      for (const responsible_area of data.responsible_areas) {
        let found: ResponsibleArea
        if (responsible_area.uniquename) {
          found = await DatabaseService.findOne(
            'projectreference',
            ResponsibleArea,
            {
              uniquename: responsible_area.uniquename,
            }
          )
        }
        if (!found) {
          found = new ResponsibleArea()
        }
        found = await found.init(responsible_area)
        this.responsible_areas.add(found)
      }
    }

    if (data.competence_fields) {
      if (clear) {
        this.competence_fields.removeAll()
      }
      for (const competence_field of data.competence_fields) {
        let found: CompetenceField
        if (competence_field.uniquename) {
          found = await DatabaseService.findOne(
            'projectreference',
            CompetenceField,
            {
              uniquename: competence_field.uniquename,
            }
          )
        }
        if (!found) {
          found = new CompetenceField()
        }
        found = await found.init(competence_field)
        this.competence_fields.add(found)
      }
    }

    if (data.attachements) {
      if (clear) {
        this.attachements.removeAll()
      }
      for (const attachement of data.attachements) {
        let found: Document
        if (attachement.id) {
          found = await DatabaseService.findOne('system', Document, {
            id: attachement.id,
          })
        }
        if (!found) {
          found = new Document()
        }
        found = await found.init(attachement)
        this.attachements.add(found)
      }
    }

    if (data.images) {
      if (clear) {
        this.images.removeAll()
      }
      for (const image of data.images) {
        let found: Document
        if (image.id) {
          found = await DatabaseService.findOne('system', Document, {
            id: image.id,
          })
        }
        if (!found) {
          found = new Document()
        }
        found = await found.init(image)
        this.images.add(found)
      }
    }

    return this
  }

  public static getDatamodel() {
    return {
      __meta: {
        db: 'data',
        name: 'projectreference',
        title: 'Projektreferenz',
        titlePlural: 'Projektreferenzen',
        icon: 'fa fa-project-diagram',
        isListable: true,
        isMain: true,
        parent: 4,
        sort: 'label',
      },
      id: {
        label: 'ID',
        type: 'number',
        isEditable: false,
        isListable: false,
      },
      projectname: {
        label: 'Projektname',
        type: 'string',
      },
      uniquename: {
        label: 'Eindeutiger Name',
        type: 'string',
      },
      attachements: {
        label: 'Anhänge',
        multiple: true,
        type: Document.getDatamodel(),
        isListable: false,
      },
      budget: {
        label: 'Budget',
        type: 'string',
        isListable: false,
      },
      client: {
        label: 'Kunde',
        type: Company.getDatamodel(),
      },
      competence_fields: {
        label: 'Kompetenzfelder',
        type: 'string',
        isListable: false,
      },
      complexity: {
        label: 'Komplexität',
        type: Complexity.getDatamodel(),
        isListable: false,
      },
      complexity_string: {
        label: 'Komplexität',
        type: 'string',
        isListable: false,
      },
      content: {
        label: 'Komplexität',
        type: 'string',
        isListable: false,
      },
      end_date: {
        label: 'Enddatum',
        type: 'date',
        isListable: false,
      },
      function: {
        label: 'Funktion',
        type: 'string',
        isListable: false,
      },
      images: {
        label: 'Bilder',
        multiple: true,
        type: Document.getDatamodel(),
        isListable: false,
      },
      industries: {
        label: 'Branchen',
        multiple: true,
        type: Industry.getDatamodel(),
        isListable: false,
      },
      keywords: {
        label: 'Stichwörter',
        multple: true,
        type: 'string',
        isListable: false,
      },
      load: {
        label: 'Load',
        type: 'string',
        isListable: false,
      },
      main_image: {
        label: 'Hauptbild',
        type: Document.getDatamodel(),
        isListable: false,
      },
      novelty: {
        label: 'Neuartigkeit',
        type: 'string',
        isListable: false,
      },
      potential: {
        label: 'Potential',
        type: 'string',
        isListable: false,
      },
      reference_person: {
        label: 'Referenzperson',
        type: Contact.getDatamodel(true),
        isListable: false,
      },
      responsible_areas: {
        label: 'Verantwortungsbereiche',
        multiple: true,
        type: ResponsibleArea.getDatamodel(),
        isListable: false,
      },
      responsible_areas_text: {
        label: 'Verantwortungsbereiche',
        type: 'string',
        isListable: false,
      },
      risk: {
        label: 'Risiko',
        type: 'string',
        isListable: false,
      },
      roles: {
        label: 'Rollen',
        multiple: true,
        type: Role.getDatamodel(),
        isListable: false,
      },
      start_date: {
        label: 'Startdatum',
        type: 'date',
        isListable: false,
      },
      strategic: {
        label: 'Strategisch',
        type: 'string',
        isListable: false,
      },
      targets: {
        label: 'Ziele',
        type: 'string',
        isListable: false,
      },
      teaser: {
        label: 'Teaser',
        type: 'string',
        isListable: false,
      },
    }
  }
}
