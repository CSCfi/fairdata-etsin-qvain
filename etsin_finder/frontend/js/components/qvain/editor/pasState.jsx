import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { inject, observer } from 'mobx-react'
import Translate from 'react-translate-component'

// If we have a PAS dataset, show information on current state.
const PasState = (props) => {
  const { isPas, readonly, preservationState } = props.Stores.Qvain
  if (!isPas) {
    return null
  }
  const key = readonly ? 'readonly' : 'editable'
  return (
    <PasInfoText>
      <Translate
        content="qvain.pasInfo.stateInfo"
        with={{
          state: preservationState,
          description: <Translate content={`qvain.pasState.${preservationState}`} />
        }}
      />{' '}
      <Translate content={`qvain.pasInfo.${key}`} />
    </PasInfoText>
  )
}

PasState.propTypes = {
  Stores: PropTypes.object.isRequired,
}

const PasInfoText = styled.div`
  background-color: #e8ffeb;
  text-align: center;
  width: 100%;
  color: green;
  z-index: 2;
  border-bottom: 1px solid rgba(0,0,0,0.3);
  position: relative;
  min-width: 300px;
  padding: 0.25em;
`

export default inject('Stores')(observer(PasState))
