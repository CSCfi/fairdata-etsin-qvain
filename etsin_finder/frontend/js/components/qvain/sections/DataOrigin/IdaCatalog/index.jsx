import { observer } from 'mobx-react'
import FilePicker from '../general/FilePicker'
import CumulativeDataset from './CumulativeDataset'
import DoiSelection from './DoiSelection'

const IdaCatalog = () => (
  <>
    <FilePicker />
    <DoiSelection />
    <CumulativeDataset />
  </>
)

export default observer(IdaCatalog)
