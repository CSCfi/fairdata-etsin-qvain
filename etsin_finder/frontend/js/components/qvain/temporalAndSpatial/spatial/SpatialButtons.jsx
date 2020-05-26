import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { inject, observer } from 'mobx-react'
import Translate from 'react-translate-component'
import translate from 'counterpart'
import styled from 'styled-components'
import { SaveButton, CancelButton } from '../../general/buttons'
import { spatialNameSchema, spatialAltitudeSchema } from '../../utils/formValidation'
import ValidationError from '../../general/validationError'

class SpatialButtons extends Component {
    static propTypes = {
      Stores: PropTypes.object.isRequired,
      handleRequestClose: PropTypes.func.isRequired
    }

    state = {
      validationError: ''
    }

    handleSave = async () => {
      const { spatialInEdit, saveSpatial, clearSpatialInEdit } = this.props.Stores.Qvain.Spatials
      try {
        await spatialNameSchema.validate(spatialInEdit.name)
        await spatialAltitudeSchema.validate(spatialInEdit.altitude)
        await saveSpatial()
        clearSpatialInEdit()
      } catch (e) {
        // number validation translation cannot be placed into validationForm because number() doesn't have message argument
        if (!await spatialAltitudeSchema.isValid(spatialInEdit.altitude)) {
          this.setState({ validationError: translate('qvain.temporalAndSpatial.spatial.error.altitudeNan') })
        } else {
          this.setState({ validationError: e.message })
        }
      }
    }

    render() {
      const { handleRequestClose } = this.props
      const { readonly } = this.props.Stores
      const { validationError } = this.state

      return (
        <ButtonAndErrorContainer>
          <ValidationError>{validationError}</ValidationError>
          <div>
            <Translate
              component={CancelButton}
              onClick={handleRequestClose}
              content="qvain.temporalAndSpatial.spatial.modal.buttons.cancel"
            />
            <Translate
              disabled={readonly}
              component={SaveButton}
              onClick={this.handleSave}
              content="qvain.temporalAndSpatial.spatial.modal.buttons.save"
            />
          </div>
        </ButtonAndErrorContainer>
      )
    }
}

const ButtonAndErrorContainer = styled.div`
  position: absolute;
  bottom: 2em;
`

export default inject('Stores')(observer(SpatialButtons))
