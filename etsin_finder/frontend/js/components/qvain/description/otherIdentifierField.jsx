import React from 'react'
import { observer } from 'mobx-react'
import styled from 'styled-components'
import Translate from 'react-translate-component'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import translate from 'counterpart'
import Card from '../general/card'
import Label from '../general/card/label'
import { otherIdentifiersArraySchema, otherIdentifierSchema } from '../utils/formValidation'
import ValidationError from '../general/errors/validationError'
import { Input, LabelLarge } from '../general/modal/form'
import { ButtonContainer, AddNewButton } from '../general/buttons'
import { useStores } from '../utils/stores'

const OtherIdentifierField = () => {
  const {
    Qvain: {
      readonly,
      removeOtherIdentifier,
      setOtherIdentifier,
      otherIdentifier,
      otherIdentifiersArray,
      addOtherIdentifier,
      otherIdentifiersValidationError,
      setOtherIdentifierValidationError,
    },
  } = useStores()

  const handleInputChange = event => {
    const { value } = event.target
    setOtherIdentifier(value)
  }

  const clearInput = () => {
    setOtherIdentifier('')
  }

  const handleAddClick = () => {
    otherIdentifierSchema
      .validate(otherIdentifier)
      .then(() => {
        if (!otherIdentifiersArray.includes(otherIdentifier)) {
          addOtherIdentifier(otherIdentifier)
          clearInput()
        } else {
          setOtherIdentifierValidationError(
            translate('qvain.description.otherIdentifiers.alreadyAdded')
          )
        }
      })
      .catch(err => {
        setOtherIdentifierValidationError(err.errors)
      })
  }

  const handleRemove = identifier => {
    removeOtherIdentifier(identifier)
  }

  const handleBlur = () => {
    setOtherIdentifierValidationError(null)
    validateOtherIdentifiers()
  }

  const validateOtherIdentifiers = () => {
    otherIdentifiersArraySchema
      .validate(otherIdentifiersArray)
      .then(() => {
        setOtherIdentifierValidationError(null)
      })
      .catch(err => {
        setOtherIdentifierValidationError(err.errors)
      })
  }

  const otherIdentifiersLabels = otherIdentifiersArray.map(identifier => (
    <Label color="primary" margin="0 0.5em 0.5em 0" key={identifier}>
      <PaddedWord>{identifier}</PaddedWord>
      <FontAwesomeIcon onClick={() => handleRemove(identifier)} icon={faTimes} size="xs" />
    </Label>
  ))

  return (
    <Card bottomContent>
      <LabelLarge htmlFor="otherIdentifiersInput">
        <Translate content="qvain.description.otherIdentifiers.title" />
      </LabelLarge>
      <Translate component="p" content="qvain.description.otherIdentifiers.instructions" />
      {otherIdentifiersLabels}
      <Input
        type="text"
        id="otherIdentifiersInput"
        disabled={readonly}
        value={otherIdentifier}
        onChange={handleInputChange}
        placeholder="http://doi.org/"
        onBlur={handleBlur}
      />
      {otherIdentifiersValidationError && (
        <ValidationError>{otherIdentifiersValidationError}</ValidationError>
      )}
      <ButtonContainer>
        <AddNewButton type="button" onClick={handleAddClick} disabled={readonly}>
          <Translate content="qvain.description.otherIdentifiers.addButton" />
        </AddNewButton>
      </ButtonContainer>
    </Card>
  )
}

const PaddedWord = styled.span`
  padding-right: 10px;
`

export default observer(OtherIdentifierField)
