{
  /**
   * This file is part of the Etsin service
   *
   * Copyright 2017-2018 Ministry of Education and Culture, Finland
   *
   *
   * @author    CSC - IT Center for Science Ltd., Espoo Finland <servicedesk@csc.fi>
   * @license   MIT
   */
}
import React, { Component } from 'react'
import styled from 'styled-components'
import Translate from 'react-translate-component'

import ElasticQuery from '../../../stores/view/elasticquery'
import { InvertedButton } from '../../general/button'

export default class ClearFilters extends Component {
  clear = () => {
    ElasticQuery.clearFilters()
    ElasticQuery.queryES()
  }

  render() {
    return (
      <CustomButton onClick={this.clear} color="primary" open={ElasticQuery.filter.length > 0}>
        <Translate content="search.filter.clearFilter" />
      </CustomButton>
    )
  }
}

const CustomButton = styled(InvertedButton)`
  display: ${p => (p.open ? 'initial' : 'none')};
  width: 100%;
  transition: 0.2s ease;
  margin: 0;
  margin-bottom: 0.5em;
`
