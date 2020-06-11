import React from 'react'
import { inject, observer } from 'mobx-react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import Translate from 'react-translate-component'
import {
    ButtonGroup,
    ButtonLabel,
    EditButton,
    DeleteButton,
    ButtonContainer
} from '../../general/buttons'

const Spatials = ({ Stores }) => {
    const { removeSpatial, editSpatial } = Stores.Qvain.Spatials
    const { spatials } = Stores.Qvain

    const SpatialElements = spatials.map(spatial => (
      <SpatialContainer key={spatial.uiid}>
        <Label>{spatial.name}</Label>
        <ButtonContainer>
          <Translate
            component={EditButton}
            type="button"
            onClick={() => editSpatial(spatial.uiid)}
            attributes={{ 'aria-label': 'qvain.general.buttons.edit' }}
          />
          <Translate
            component={DeleteButton}
            type="button"
            onClick={() => removeSpatial(spatial.uiid)}
            attribute={{ 'aria-label': 'qvain.general.buttons.remove' }}
          />
        </ButtonContainer>
      </SpatialContainer>
    ))

    return SpatialElements
}

Spatials.propTypes = {
    Stores: PropTypes.object.isRequired
}

const SpatialContainer = styled(ButtonGroup)`
    display: flex;
    align-items: center;
    justify-content: space-between;
`

const Label = styled(ButtonLabel)`
  white-space: normal;
  overflow: hidden;
  height: auto;
  word-break: break-word;
`

export default inject('Stores')(observer(Spatials))
