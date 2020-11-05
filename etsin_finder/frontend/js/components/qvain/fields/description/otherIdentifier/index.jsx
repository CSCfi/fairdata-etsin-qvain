import React from 'react'
import { observer } from 'mobx-react'
import styled from 'styled-components'
import Translate from 'react-translate-component'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import translate from 'counterpart'
import Card from '../../../general/card'
import Label from '../../../general/card/label'
import { otherIdentifiersArraySchema, otherIdentifierSchema } from '../../../utils/formValidation'
import ValidationError from '../../../general/errors/validationError'
import { Input, LabelLarge } from '../../../general/modal/form'
import { ButtonContainer, AddNewButton } from '../../../general/buttons'
import { useStores } from '../../../utils/stores'

const OtherIdentifierField = () => {
  const {
    Qvain: {
      OtherIdentifiers: {
        remove,
        setValidationError,
        validationError,
        storage,
        itemStr,
        addItemStr,
        setItemStr,
        readonly,
      },
    },
  } = useStores()

  const handleInputChange = event => {
    const { value } = event.target
    setItemStr(value)
  }

  const handleAddClick = () => {
    otherIdentifierSchema
      .validate(itemStr)
      .then(() => {
        if (!storage.includes(itemStr)) {
          addItemStr()
        } else {
          setValidationError(translate('qvain.description.otherIdentifiers.alreadyAdded'))
        }
      })
      .catch(err => {
        setValidationError(err.errors)
      })
  }

  const handleRemove = identifier => {
    remove(identifier)
  }

  const handleBlur = () => {
    setValidationError(null)
    validateOtherIdentifiers()
  }

  const validateOtherIdentifiers = () => {
    otherIdentifiersArraySchema
      .validate(storage)
      .then(() => {
        setValidationError(null)
      })
      .catch(err => {
        setValidationError(err.errors)
      })
  }

  const otherIdentifiersLabels = storage.map(identifier => (
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
        value={itemStr}
        onChange={handleInputChange}
        placeholder="http://doi.org/"
        onBlur={handleBlur}
      />
      {validationError && <ValidationError>{validationError}</ValidationError>}
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
