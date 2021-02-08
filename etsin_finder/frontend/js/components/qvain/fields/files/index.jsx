import React, { useState } from 'react'
import Translate from 'react-translate-component'
import translate from 'counterpart'
import { observer } from 'mobx-react'

import { withFieldErrorBoundary } from '../../general/errors/fieldErrorBoundary'
import { SectionTitle } from '../../general/section'
import { ContainerLight, ContainerSubsectionBottom } from '../../general/card'
import { HelpIcon } from '../../general/modal/form'
import IDAFilePicker from './ida'
import ExternalFiles from './external/externalFiles'
import DataCatalog from './dataCatalog'
import CumulativeState from './cumulativeState'
import CumulativeStateV2 from './cumulativeStateV2'
import { DATA_CATALOG_IDENTIFIER } from '../../../../utils/constants'
import Tooltip from '../../general/section/tooltip'
import FilesInfo from './filesInfo'
import MetadataModal from './metadataModal'
import ClearMetadataModal from './metadataModal/clearMetadataModal'
import SelectedItems from './ida/selectedItems'
import LegacyFilePicker from './legacy/idaFilePicker'
import LegacySelectedFiles from './legacy/selectedFiles'
import FormModal from './ida/forms/formModal'
import { useStores } from '../../utils/stores'

const Files = () => {
  const {
    Qvain: { dataCatalog, isPas },
    Env: { metaxApiV2 },
  } = useStores()
  const [tooltipOpen, setTooltipOpen] = useState(false)

  const getData = () => {
    const SelectedItemsComponent = metaxApiV2 ? SelectedItems : LegacySelectedFiles
    const FilePickerComponent = metaxApiV2 ? IDAFilePicker : LegacyFilePicker

    if (isPas) {
      return (
        <>
          {metaxApiV2 && <FormModal />}
          <ContainerSubsectionBottom>
            <SelectedItemsComponent />
          </ContainerSubsectionBottom>
        </>
      )
    }
    if (dataCatalog === DATA_CATALOG_IDENTIFIER.IDA) {
      return (
        <>
          <ContainerSubsectionBottom>
            <FilePickerComponent />
          </ContainerSubsectionBottom>
          {metaxApiV2 ? <CumulativeStateV2 /> : <CumulativeState />}
        </>
      )
    }
    if (dataCatalog === DATA_CATALOG_IDENTIFIER.ATT) {
      return (
        <ContainerSubsectionBottom>
          <ExternalFiles />
        </ContainerSubsectionBottom>
      )
    }
    return null
  }

  return (
    <ContainerLight className="container">
      <SectionTitle>
        <Translate content="qvain.files.title" />
        <Tooltip
          isOpen={tooltipOpen}
          close={() => setTooltipOpen(!tooltipOpen)}
          align="Right"
          text={<FilesInfo />}
        >
          <HelpIcon
            aria-label={translate('qvain.files.infoTitle')}
            onClick={() => setTooltipOpen(!tooltipOpen)}
          />
        </Tooltip>
      </SectionTitle>
      <DataCatalog />
      {getData()}
      <MetadataModal />
      <ClearMetadataModal />
    </ContainerLight>
  )
}

export default withFieldErrorBoundary(observer(Files), 'qvain.files.title')
