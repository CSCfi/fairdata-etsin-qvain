import React, { Component } from 'react'
import Translate from 'react-translate-component'
import translate from 'counterpart'
import PropTypes from 'prop-types'
import { inject, observer } from 'mobx-react'
import { SectionTitle } from '../general/section'
import { ContainerLight, ContainerSubsectionBottom } from '../general/card'
import { HelpIcon } from '../general/form'
import IDAFilePicker from './ida'
import ExternalFiles from './external/externalFiles'
import DataCatalog from './dataCatalog'
import CumulativeState from './cumulativeState'
import CumulativeStateV2 from './cumulativeStateV2'
import { DATA_CATALOG_IDENTIFIER } from '../../../utils/constants'
import Tooltip from '../general/tooltip'
import FilesInfo from './filesInfo'
import MetadataModal from './metadataModal'
import SelectedItems from './ida/selectedItems'
import LegacyFilePicker from './legacy/idaFilePicker'
import LegacySelectedFiles from './legacy/selectedFiles'

class Files extends Component {
  static propTypes = {
    Stores: PropTypes.object.isRequired,
  }

  state = {
    tooltipOpen: false,
  }

  render() {
    const { dataCatalog, isPas } = this.props.Stores.Qvain
    const { metaxApiV2 } = this.props.Stores.Env
    let data = null

    const SelectedItemsComponent = metaxApiV2 ? SelectedItems : LegacySelectedFiles
    const FilePickerComponent = metaxApiV2 ? IDAFilePicker : LegacyFilePicker

    if (isPas) {
      data = (
        <>
          <ContainerSubsectionBottom>
            <SelectedItemsComponent />
          </ContainerSubsectionBottom>
        </>
      )
    } else if (dataCatalog === DATA_CATALOG_IDENTIFIER.IDA) {
      data = (
        <>
          { metaxApiV2 ? <CumulativeStateV2 /> : <CumulativeState /> }
          <ContainerSubsectionBottom>
            <FilePickerComponent />
          </ContainerSubsectionBottom>
        </>
      )
    } else if (dataCatalog === DATA_CATALOG_IDENTIFIER.ATT) {
      data = (
        <ContainerSubsectionBottom>
          <ExternalFiles />
        </ContainerSubsectionBottom>
      )
    }
    return (
      <ContainerLight className="container">
        <SectionTitle>
          <Translate content="qvain.files.title" />
          <Tooltip
            isOpen={this.state.tooltipOpen}
            close={() =>
              this.setState(prevState => ({
                tooltipOpen: !prevState.tooltipOpen,
              }))
            }
            align="Right"
            text={<FilesInfo />}
          >
            <HelpIcon
              aria-label={translate('qvain.files.infoTitle')}
              onClick={() =>
                this.setState(prevState => ({
                  tooltipOpen: !prevState.tooltipOpen,
                }))
              }
            />
          </Tooltip>
        </SectionTitle>
        <DataCatalog />
        {data}
        <MetadataModal />
      </ContainerLight>
    )
  }
}

export default inject('Stores')(observer(Files))
