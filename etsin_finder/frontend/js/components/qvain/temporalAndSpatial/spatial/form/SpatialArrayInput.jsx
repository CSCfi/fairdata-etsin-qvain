import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Translate from 'react-translate-component'
import { inject, observer } from 'mobx-react'
import uuid from 'uuid/v4'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import { Input, Label } from '../../../general/form'
import ValidationError from '../../../general/validationError'
import Button from '../../../../general/button'

class SpatialArrayInput extends Component {
  static propTypes = {
    Stores: PropTypes.object.isRequired,
    datum: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    handleBlur: PropTypes.func,
    error: PropTypes.string.isRequired,
    isRequired: PropTypes.bool,
  }

  static defaultProps = {
    isRequired: false,
    handleBlur: () => {},
  }

  translations = datum => ({
    label: `qvain.temporalAndSpatial.spatial.modal.${datum}Input.label`,
    placeholder: `qvain.temporalAndSpatial.spatial.modal.${datum}Input.placeholder`,
  })

  renderInputs = () => {
    const { datum, handleBlur, type } = this.props
    const { changeSpatialAttribute, spatialInEdit } = this.props.Stores.Qvain.Spatials
    const { readonly } = this.props.Stores

    const translations = this.translations(datum)

    const onChange = (event, id) => {
      const arr = [...spatialInEdit[datum]]
      arr[id].value = event.target.value
      changeSpatialAttribute(datum, arr)
    }

    const onRemoveClick = id => {
      const arr = [...spatialInEdit[datum]]
      arr.splice(id, 1)
      changeSpatialAttribute(datum, arr)
    }

    return spatialInEdit[datum].map((item, id) => (
      <div key={`${item.key}-${datum}-item`} style={{ display: 'flex', alignItems: 'center' }}>
        <Translate
          component={SpatialInputElem}
          type={type}
          id={`${datum}Field`}
          autoFocus
          attributes={{ placeholder: translations.placeholder }}
          disabled={readonly}
          value={item.value || ''}
          onChange={event => onChange(event, id)}
          onBlur={() => handleBlur()}
        />
        <Translate
          component={RemoveButton}
          onClick={() => onRemoveClick(id)}
          attributes={{ 'aria-label': 'qvain.general.buttons.remove' }}
        >
          <FontAwesomeIcon icon={faTimes} />
        </Translate>
      </div>
    ))
  }

  render() {
    const { datum, error, isRequired } = this.props

    const translations = this.translations(datum)
    const { changeSpatialAttribute, spatialInEdit } = this.props.Stores.Qvain.Spatials

    const addGeometry = () => {
      const arr = [...spatialInEdit[datum]]
      arr.push({ key: uuid(), value: '' })
      changeSpatialAttribute(datum, arr)
    }

    return (
      <>
        <Label htmlFor={`${datum}Field`}>
          <Translate content={translations.label} /> {isRequired ? '*' : ''}
        </Label>
        {this.renderInputs()}
        <Button onClick={addGeometry}>
          <Translate content="qvain.temporalAndSpatial.spatial.modal.buttons.addGeometry" />
        </Button>
        {error && <SpatialError>{error}</SpatialError>}
      </>
    )
  }
}

const RemoveButton = styled(Button)`
  display: flex;
  align-items: stretch;
  padding: 0.5em 0.6em;
  margin-bottom: 1em;
`

const SpatialError = styled(ValidationError)`
  margin-bottom: 0.5rem;
`

const SpatialInputElem = styled(Input)`
  margin-bottom: 0.75rem;
  + ${SpatialError} {
    margin-top: -0.5rem;
  }
`

export default inject('Stores')(observer(SpatialArrayInput))
