import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Translate from 'react-translate-component'
import { observer } from 'mobx-react'
import { runInAction } from 'mobx'
import { v4 as uuidv4 } from 'uuid'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import { Input, Label } from '../../../../general/modal/form'
import ValidationError from '../../../../general/errors/validationError'
import Button from '../../../../../general/button'

const ModalArrayInput = ({ datum, handleBlur, type, Field, error, isRequired }) => {
  const { changeAttribute, readonly, translationsRoot } = Field

  const translations = {
    label: `${translationsRoot}.modal.${datum}Input.label`,
    placeholder: `${translationsRoot}.modal.${datum}Input.placeholder`,
  }

  const onChange = (event, id) => {
    runInAction(() => {
      const arr = [...Field.inEdit[datum]]
      arr[id].value = event.target.value
      changeAttribute(datum, arr)
    })
  }

  const onRemoveClick = id => {
    const arr = [...Field.inEdit[datum]]
    arr.splice(id, 1)
    changeAttribute(datum, arr)
  }

  const renderInputs = () =>
    Field.inEdit[datum].map((item, id) => (
      <SpatialItemWrapper key={`${item.key}-${datum}-item`}>
        <Translate
          component={ArrayInputElem}
          type={type}
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
          disabled={Field.readonly}
        >
          <FontAwesomeIcon icon={faTimes} />
        </Translate>
      </SpatialItemWrapper>
    ))

  return (
    <ModalArrayInputWrapper>
      <Label>
        <Translate content={translations.label} /> {isRequired ? '*' : ''}
      </Label>
      {renderInputs()}
      <AddButton
        onClick={() => {
          const arr = [...Field.inEdit[datum]]
          arr.push({ key: uuidv4(), value: '' })
          changeAttribute(datum, arr)
        }}
        disabled={Field.readonly}
      >
        <Translate content={`${translationsRoot}.modal.buttons.addGeometry`} />
      </AddButton>
      {error && <ArrayInputError>{error}</ArrayInputError>}
    </ModalArrayInputWrapper>
  )
}

ModalArrayInput.propTypes = {
  Field: PropTypes.object.isRequired,
  datum: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  handleBlur: PropTypes.func,
  error: PropTypes.string,
  isRequired: PropTypes.bool,
}

ModalArrayInput.defaultProps = {
  isRequired: false,
  handleBlur: () => {},
  error: '',
}

const ModalArrayInputWrapper = styled.div`
  margin-bottom: 8px;
`

const AddButton = styled(Button)`
  margin-left: 0;
`

const RemoveButton = styled(Button)`
  display: flex;
  align-items: stretch;
  padding: 0.5em 0.6em;
  margin-bottom: 1em;
`

const ArrayInputError = styled(ValidationError)`
  margin-bottom: 0.5rem;
`

const ArrayInputElem = styled(Input)`
  margin-bottom: 0.75rem;
  + ${ArrayInputError} {
    margin-top: -0.5rem;
  }
`

const SpatialItemWrapper = styled.div`
  display: flex;
  align-items: center;
`

export default observer(ModalArrayInput)
