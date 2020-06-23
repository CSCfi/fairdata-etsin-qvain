import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Translate from 'react-translate-component'
import { inject, observer } from 'mobx-react'
import { Input, Label } from '../../../general/form'
import ValidationError from '../../../general/validationError'


class SpatialInput extends Component {
    static propTypes = {
        Stores: PropTypes.object.isRequired,
        datum: PropTypes.string.isRequired,
        type: PropTypes.string.isRequired,
        handleBlur: PropTypes.func,
        error: PropTypes.string.isRequired,
        isRequired: PropTypes.bool
    }

    static defaultProps = {
      isRequired: false,
      handleBlur: () => {}
    }

    translations = (datum) => ({
      label: `qvain.temporalAndSpatial.spatial.modal.${datum}Input.label`,
      placeholder: `qvain.temporalAndSpatial.spatial.modal.${datum}Input.placeholder`
    })

    render() {
        const { datum, handleBlur, type, error, isRequired } = this.props
        const { readonly } = this.props.Stores
        const { changeSpatialAttribute, spatialInEdit } = this.props.Stores.Qvain.Spatials

        const translations = this.translations(datum)

        return (
          <>
            <Label htmlFor={`${datum}Field`}>
              <Translate content={translations.label} /> {isRequired ? '*' : ''}
            </Label>
            <Translate
              component={SpatialInputElem}
              type={type}
              id={`${datum}Field`}
              autoFocus
              attributes={{ placeholder: translations.placeholder }}
              disabled={readonly}
              value={spatialInEdit[datum] || ''}
              onChange={(event) => changeSpatialAttribute(datum, event.target.value)}
              onBlur={() => handleBlur()}
            />
            {error && <SpatialError>{error}</SpatialError>}
          </>
        )
    }
}


export const SpatialError = styled(ValidationError)`
  margin-bottom: 0.5rem;
`

export const SpatialInputElem = styled(Input)`
    margin-bottom: 0.75rem;
    + ${SpatialError} {
      margin-top: -0.5rem;
    }
  `

export default inject('Stores')(observer(SpatialInput))
