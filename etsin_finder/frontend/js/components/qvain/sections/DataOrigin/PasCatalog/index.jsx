import { observer } from 'mobx-react'
import License from '../general/AccessRights/License'
import FilePicker from '../general/FilePicker'
import AccessType from '../general/AccessRights/AccessType'

const PasCatalog = () => (
  <>
    <FilePicker />
    <AccessType />
    <License />
  </>
)

export default observer(PasCatalog)
