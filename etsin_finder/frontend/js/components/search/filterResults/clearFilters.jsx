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
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import ElasticQuery from '../../../stores/view/elasticquery'
import { InvertedButton } from '../../general/button'

class ClearFilters extends Component {
  clear = () => {
    ElasticQuery.clearFilters(this.props.history)
    ElasticQuery.queryES()
  }

  render() {
    return (
      <CustomButton onClick={this.clear} color="primary" open={ElasticQuery.filter.length > 0}>
        Clear filters
      </CustomButton>
    )
  }
}

ClearFilters.propTypes = {
  history: PropTypes.object.isRequired,
}

const CustomButton = styled(InvertedButton)`
  display: ${p => (p.open ? 'initial' : 'none')};
  width: 100%;
  transition: 0.2s ease;
  margin: 0;
  margin-bottom: 0.5em;
`

export default withRouter(ClearFilters)
