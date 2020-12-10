import { Collection } from '@mikro-orm/core'
import CompetenceField from '../../../model/projectreferences/CompentenceField'
import Industry from '../../../model/projectreferences/Industry'
import ResponsibleArea from '../../../model/projectreferences/ResponsbileArea'
import Role from '../../../model/projectreferences/Role'
import Document from '../../../model/system/Document'
import ICompany from '../data/ICompany'
import IContact from '../data/IContact'
import IDocument from '../system/IDocument'
import IEmployee from '../website/IEmployee'
import IService from '../website/IService'
import ICompetenceField from './ICompetenceField'
import IComplexity from './IComplexity'
import IIndustry from './IIndustry'
import IResponsibleArea from './IResponsibleArea'
import IRole from './IRole'

export default abstract class IProjectreference {
  abstract id?: number
  abstract projectname?: string
  abstract uniquename?: string
  abstract content?: string
  abstract teaser?: string
  abstract keywords?: string[]
  abstract targets?: string[]
  abstract client?: ICompany
  abstract reference_person?: IContact
  abstract start_date?: number
  abstract end_date?: number
  abstract function?: string
  abstract roles?: Collection<Role> | IRole[]
  // abstract involved_employees?: Collection<Employee> | IEmployee[]
  // abstract services?: Collection<Service> | IService[]
  abstract load?: string
  abstract complexity?: IComplexity
  abstract strategic?: string
  abstract novelty?: string
  abstract complexity_string?: string
  abstract risk?: string
  abstract potential?: string
  abstract budget?: string
  abstract industries?: Collection<Industry> | IIndustry[]
  abstract responsible_areas?: Collection<ResponsibleArea> | IResponsibleArea[]
  abstract responsible_areas_text?: string
  abstract competence_fields?: Collection<CompetenceField> | ICompetenceField[]
  abstract attachements?: Collection<Document> | IDocument[]
  abstract main_image?: IDocument
  abstract images?: Collection<Document> | IDocument[]
}
