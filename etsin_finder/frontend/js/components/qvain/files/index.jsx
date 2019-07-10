import React, { Component } from 'react';
import Translate from 'react-translate-component'
import PropTypes from 'prop-types'
import { inject, observer } from 'mobx-react'
import { SectionTitle } from '../general/section'
import { ContainerLight, ContainerSubsection } from '../general/card'
import { HelpIcon } from '../general/form'
import IDAFilePicker from './idaFilePicker'
import ExternalFiles from './externalFiles'
import DataCatalog from './dataCatalog'
import { DataCatalogIdentifiers } from '../utils/constants'

class Files extends Component {
  static propTypes = {
    Stores: PropTypes.object.isRequired
  }

  render() {
    const { dataCatalog } = this.props.Stores.Qvain
    let data = null
    if (dataCatalog === DataCatalogIdentifiers.IDA) {
      data = (
        <ContainerSubsection>
          <IDAFilePicker />
        </ContainerSubsection>
      )
    }
<<<<<<< HEAD
    if (dataCatalog === DataCatalogIdentifiers.ATT) {
=======
    if (dataCatalog && dataCatalog.value === DataCatalogIdentifiers.ATT) {
>>>>>>> 3406e976dd0712d30d5af6a5e6fbe0ca45f19158
      data = (
        <ContainerSubsection>
          <ExternalFiles />
        </ContainerSubsection>
      )
    }
    return (
      <ContainerLight className="container">
        <SectionTitle>
          <Translate content="qvain.files.title" />
          <Translate component={HelpIcon} attributes={{ title: 'qvain.files.help' }} />
        </SectionTitle>
        <DataCatalog />
        { data }
      </ContainerLight>
    )
  }
}

export default inject('Stores')(observer(Files))
