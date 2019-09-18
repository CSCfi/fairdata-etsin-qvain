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
  import { inject, observer } from 'mobx-react'
  import styled from 'styled-components'
  import PropTypes from 'prop-types'
  import Translate from 'react-translate-component'

  class FairdataPasDatasetIcon extends Component {
    render() {
      if (
        (this.props.preservation_state > 0)
        &&
        (this.props.data_catalog_identifier !== 'urn:nbn:fi:att:data-catalog-pas')
      ) {
        return (
          <FairdataPasIconContainerEnteringPas>
            <FairdataPasIconLabel>
              <Translate content="dataset.enteringPas" />
            </FairdataPasIconLabel>
          </FairdataPasIconContainerEnteringPas>
        )
      }
        return (
          <FairdataPasIconContainerInPas>
            <FairdataPasIconLabel>
              Fairdata PAS
            </FairdataPasIconLabel>
          </FairdataPasIconContainerInPas>
        )
    }
  }

  export default inject('Stores')(observer(FairdataPasDatasetIcon))
  export const undecorated = FairdataPasDatasetIcon

  const FairdataPasIconContainerInPas = styled.div`
    padding: 0.2em 0.9em;
    background-color: #b3efb0;
    border-radius: 1em;
    margin-right: 5px;
  `

  const FairdataPasIconContainerEnteringPas = styled.div`
  padding: 0.2em 0.9em;
  background-color: #EFE4B0;
  border-radius: 1em;
  margin-right: 5px;
`

  const FairdataPasIconLabel = styled.div`
    display: inline;
    white-space: nowrap;
  `
  FairdataPasDatasetIcon.defaultProps = {
    preservation_state: undefined,
    data_catalog_identifier: undefined,
  }

  FairdataPasDatasetIcon.propTypes = {
    preservation_state: PropTypes.number,
    data_catalog_identifier: PropTypes.string,
  }
