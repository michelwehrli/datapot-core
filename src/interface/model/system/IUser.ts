import ITable from '../extends/ITable'
import IDesign from './IDesign'
import IDocument from './IDocument'

export default abstract class IUser extends ITable {
  abstract id?: number
  abstract issuperuser?: boolean
  abstract username?: string
  abstract givenname?: string
  abstract surname?: string
  abstract email?: string
  abstract image?: IDocument
  abstract password?: string
  abstract configuration?: string
  abstract design?: IDesign
  abstract refresh_token?: string
  abstract color?: string
  abstract o365_oauth_token?: string
  abstract o365_oaccess_token?: string
}
