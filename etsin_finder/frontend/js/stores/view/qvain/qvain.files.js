import QvainFilesV2 from './qvain.files.v2'
import QvainFilesV3 from './qvain.files.v3'

const createQvainFilesStore = (Qvain, Auth) => new QvainFilesV3(Qvain, Auth)

export default createQvainFilesStore

export { QvainFilesV2, QvainFilesV3 }
