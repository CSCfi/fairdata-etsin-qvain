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

class Files extends Component {
  static propTypes = {
    Stores: PropTypes.object.isRequired
  }

  render() {
    const { dataCatalog } = this.props.Stores.Qvain
    let data = null
    if (dataCatalog && dataCatalog.value === 'urn:nbn:fi:att:data-catalog-ida') {
      data = (
        <ContainerSubsection>
          <IDAFilePicker />
        </ContainerSubsection>
      )
    }
    if (dataCatalog && dataCatalog.value === 'urn:nbn:fi:att:data-catalog-att') {
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
