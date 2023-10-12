import EtsinFilesMixin from './etsin.files.mixin'
import { FilesBaseV2, FilesBaseV3 } from '../common.files'

export const EtsinFilesV2 = EtsinFilesMixin(FilesBaseV2)
export const EtsinFilesV3 = EtsinFilesMixin(FilesBaseV3)

const createFilesStore = Env => {
  if (Env.Flags.flagEnabled('ETSIN.METAX_V3.FRONTEND')) {
    return new EtsinFilesV3(Env)
  }
  return new EtsinFilesV2(Env)
}

export default createFilesStore
