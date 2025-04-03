import EtsinFilesMixin from './etsin.files.mixin'
import { FilesBaseV3 } from '../common.files'

export const EtsinFilesV3 = EtsinFilesMixin(FilesBaseV3)

const createFilesStore = Env => new EtsinFilesV3(Env)

export default createFilesStore
