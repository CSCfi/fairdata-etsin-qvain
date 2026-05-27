import { observer } from 'mobx-react'
import { useStores } from '@/stores/stores'
import { DATA_CATALOG_IDENTIFIER } from '@/utils/constants'
import Section from '@/components/qvain/general/V2/Section'
import DataCatalog from './DataCatalog'
import IdaCatalog from './IdaCatalog'
import AttCatalog from './AttCatalog'
import PasCatalog from './PasCatalog'
import AccessRights from './general/AccessRights'
import DaasCatalog from './DaasCatalog'

const DataOrigin = () => {
  const {
    Qvain: { dataCatalog, isPas },
  } = useStores()

  return (
    <Section sectionName="DataOrigin">
      <DataCatalog />
      {dataCatalog === DATA_CATALOG_IDENTIFIER.IDA && <IdaCatalog />}
      {dataCatalog === DATA_CATALOG_IDENTIFIER.ATT && <AttCatalog />}
      {dataCatalog === DATA_CATALOG_IDENTIFIER.DAAS && <DaasCatalog />}
      {isPas && <PasCatalog />}
      <AccessRights />
    </Section>
  )
}

export default observer(DataOrigin)
