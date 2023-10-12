import QvainFilesV2 from './qvain.files.v2'
import QvainFilesV3 from './qvain.files.v3'

const createQvainFilesStore = (Qvain, Auth) => {
  if (Qvain.Env.Flags.flagEnabled('QVAIN.METAX_V3.FRONTEND')) {
    return new QvainFilesV3(Qvain, Auth)
  }
  return new QvainFilesV2(Qvain, Auth)
}

export default createQvainFilesStore

export { QvainFilesV2, QvainFilesV3 }
