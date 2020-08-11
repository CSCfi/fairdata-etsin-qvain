import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { inject, observer } from 'mobx-react'
import Translate from 'react-translate-component'
import { TableButton } from './general/buttons'

// If we have a deprecated dataset, show information and button for fixing it.
const DeprecatedState = (props) => {
  const { deprecated, showFixDeprecatedModal } = props.Stores.Qvain
  if (!deprecated) {
    return null
  }
  return (
    <DeprecationInfoText>
      <Translate content="qvain.files.fixDeprecatedModal.statusText" />
      <ButtonContainer>
        <FixDeprecatedButton type="button" onClick={showFixDeprecatedModal}>
          <Translate content="qvain.files.fixDeprecatedModal.buttons.show" />
        </FixDeprecatedButton>
      </ButtonContainer>
    </DeprecationInfoText>
  )
}

DeprecatedState.propTypes = {
  Stores: PropTypes.object.isRequired,
}

const DeprecationInfoText = styled.div`
  background-color: ${ props => props.theme.color.error};
  text-align: center;
  width: 100%;
  color: white;
  z-index: 2;
  border-bottom: 1px solid rgba(0,0,0,0.3);
  position: relative;
  min-width: 300px;
  padding: 0.5rem;
`

const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`

const FixDeprecatedButton = styled(TableButton)`
  margin: 0;
  margin-top: 11px;
  width: auto;
  padding-left: 1rem;
  padding-right: 1rem;
  flex-grow: 0;
  max-width: none;
`

export default inject('Stores')(observer(DeprecatedState))
