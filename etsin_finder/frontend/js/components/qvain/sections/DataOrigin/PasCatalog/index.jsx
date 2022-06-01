import React from 'react'
import { observer } from 'mobx-react'
import License from '../general/License'
import FilePicker from '../general/FilePicker'
import AccessType from '../general/AccessType'

const PasCatalog = () => (
  <>
    <FilePicker />
    <AccessType />
    <License />
  </>
)

export default observer(PasCatalog)
