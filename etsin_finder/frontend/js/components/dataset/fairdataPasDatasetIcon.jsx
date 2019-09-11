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

  class FairdataPasDatasetIcon extends Component {
    render() {
      return (
        <FairdataPasIconContainer>
          <FairdataPasIconLabel>
            Fairdata PAS
          </FairdataPasIconLabel>
        </FairdataPasIconContainer>
      )
    }
  }

  export default inject('Stores')(observer(FairdataPasDatasetIcon))
  export const undecorated = FairdataPasDatasetIcon

  const FairdataPasIconContainer = styled.div`
    padding: 0.2em 0.9em;
    background-color: #EFE4B0;
    border-radius: 1em;
    margin-right: 5px;
  `

  const FairdataPasIconLabel = styled.div`
    display: inline;
  `
