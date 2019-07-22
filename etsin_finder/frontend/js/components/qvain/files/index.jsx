import React, { Component } from 'react'
import Translate from 'react-translate-component'
import PropTypes from 'prop-types'
import { inject, observer } from 'mobx-react'
import { SectionTitle } from '../general/section'
import { ContainerLight, ContainerSubsectionBottom } from '../general/card'
import { HelpIcon } from '../general/form'
import IDAFilePicker from './idaFilePicker'
import ExternalFiles from './externalFiles'
import DataCatalog from './dataCatalog'
import { DataCatalogIdentifiers } from '../utils/constants'
import Tooltip from '../general/tooltip'

class Files extends Component {
  static propTypes = {
    Stores: PropTypes.object.isRequired,
  }

  state = {
    popUpOpen: false,
  }

  render() {
    const { dataCatalog } = this.props.Stores.Qvain
    let data = null
    if (dataCatalog === DataCatalogIdentifiers.IDA) {
      data = (
        <ContainerSubsectionBottom>
          <IDAFilePicker />
        </ContainerSubsectionBottom>
      )
    }
    if (dataCatalog === DataCatalogIdentifiers.ATT) {
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
          <Tooltip isOpen={this.state.popUpOpen} align="Right" text="qvain.files.help">
            <HelpIcon
              onClick={() =>
                this.setState(prevState => ({
                  popUpOpen: !prevState.popUpOpen,
                }))
              }
            />
          </Tooltip>
        </SectionTitle>
        <DataCatalog />
        {data}
      </ContainerLight>
    )
  }
}

export default inject('Stores')(observer(Files))
