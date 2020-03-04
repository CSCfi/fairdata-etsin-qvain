import React, { Component } from 'react'
import Translate from 'react-translate-component'
import translate from 'counterpart'
import PropTypes from 'prop-types'
import { inject, observer } from 'mobx-react'
import { SectionTitle } from '../general/section'
import { ContainerLight, ContainerSubsectionBottom } from '../general/card'
import { HelpIcon } from '../general/form'
import IDAFilePicker from './idaFilePicker'
import ExternalFiles from './externalFiles'
import DataCatalog from './dataCatalog'
import CumulativeState from './cumulativeState'
import { DataCatalogIdentifiers } from '../utils/constants'
import Tooltip from '../general/tooltip'
import FilesInfo from './filesInfo'
import MetadataModal from './metadataModal'
import SelectedFiles from './selectedFiles'

class Files extends Component {
  static propTypes = {
    Stores: PropTypes.object.isRequired,
  }

  state = {
    tooltipOpen: false,
  }

  render() {
    const { dataCatalog, isPas } = this.props.Stores.Qvain
    let data = null
    if (isPas) {
      data = (
        <>
          <ContainerSubsectionBottom>
            <SelectedFiles />
          </ContainerSubsectionBottom>
        </>
      )
    } else if (dataCatalog === DataCatalogIdentifiers.IDA) {
      data = (
        <>
          <CumulativeState />
          <ContainerSubsectionBottom>
            <IDAFilePicker />
          </ContainerSubsectionBottom>
        </>
      )
    } else if (dataCatalog === DataCatalogIdentifiers.ATT) {
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
