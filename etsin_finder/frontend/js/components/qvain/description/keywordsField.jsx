import React, { useState } from 'react'
import Translate from 'react-translate-component'
import { observer } from 'mobx-react'
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import counterpart from 'counterpart'

import Tooltip from '../../general/tooltipHover'
import Card from '../general/card'
import Label from '../general/card/label'
import ValidationError from '../general/errors/validationError'
import { LabelLarge, Input } from '../general/modal/form'
import { keywordsSchema } from '../utils/formValidation'
import { ButtonContainer, AddNewButton } from '../general/buttons'
import { useStores } from '../utils/stores'

const KeywordsField = () => {
  const {
    Qvain: {
      readonly,
      Keywords: {
        itemStr: keywordString,
        setItemStr: setKeywordString,
        addKeyword,
        remove: removeKeyword,
        storage: keywordsArray,
      },
    },
    Locale: { lang },
  } = useStores()
  const [error, setError] = useState(null)

  const handleChange = e => {
    setKeywordString(e.target.value)
    setError(null)
  }

  const validate = () => {
    keywordsSchema
      .validate(keywordsArray)
      .then(() => {
        setError(null)
      })
      .catch(err => {
        setError(err.errors)
      })
  }

  const handleKeywordAdd = e => {
    e.preventDefault()
    addKeyword()
    validate()
  }

  const handleKeyDown = e => {
    if (e.keyCode === 188 || e.keyCode === 13) {
      handleKeywordAdd(e)
    }
  }

  const RenderedKeywords = keywordsArray.map(word => (
    <Label color="#007fad" margin="0 0.5em 0.5em 0" key={word}>
      <PaddedWord>{word}</PaddedWord>
      {!readonly && (
        <FontAwesomeIcon
          className="delete-keyword"
          size="xs"
          icon={faTimes}
          aria-label="remove"
          onClick={() => removeKeyword(word)}
        />
      )}
    </Label>
  ))

  return (
    <Card>
      <LabelLarge htmlFor="keywordsInput">
        <Tooltip
          title={counterpart('qvain.description.fieldHelpTexts.requiredToPublish', {
            locale: lang,
          })}
          position="right"
        >
          <Translate content="qvain.description.keywords.title" /> *
        </Tooltip>
      </LabelLarge>
      <Translate component="p" content="qvain.description.keywords.help" />
      {RenderedKeywords}
      <Translate
        component={Input}
        id="keywordsInput"
        disabled={readonly}
        value={keywordString}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        type="text"
        attributes={{ placeholder: 'qvain.description.keywords.placeholder' }}
      />
      <ValidationError>{error}</ValidationError>
      <ButtonContainer>
        <AddNewButton type="button" onClick={handleKeywordAdd} disabled={readonly}>
          <Translate content="qvain.description.keywords.addButton" />
        </AddNewButton>
      </ButtonContainer>
    </Card>
  )
}

const PaddedWord = styled.span`
  padding-right: 10px;
`

export default observer(KeywordsField)
