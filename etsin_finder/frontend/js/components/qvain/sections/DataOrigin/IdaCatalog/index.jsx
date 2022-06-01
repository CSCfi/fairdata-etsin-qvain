import React from 'react'
import { observer } from 'mobx-react'
import FilePicker from '../general/FilePicker'
import CumulativeDataset from './CumulativeDataset'

const IdaCatalog = () => (
  <>
    <FilePicker />
    <CumulativeDataset />
  </>
)

export default observer(IdaCatalog)
