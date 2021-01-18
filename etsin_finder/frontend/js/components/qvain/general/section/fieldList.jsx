import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import Translate from 'react-translate-component'
import { observer } from 'mobx-react'
import { ButtonGroup, ButtonLabel, EditButton, DeleteButton, ButtonContainer } from '../buttons'
import { useStores } from '../../utils/stores'

const FieldList = ({ Field, lang, translationsRoot, disableNoItemsText }) => {
  const {
    Locale: { getValueTranslation },
  } = useStores()
  const { remove, edit, storage, readonly } = Field

  if (!storage.length) {
    if (disableNoItemsText) return null
    return <Translate component="div" content={`${translationsRoot}.noItems`} />
  }

  const Elements = storage.map(item => (
    <FieldListContainer key={item.uiid}>
      <Label>{getValueTranslation(item.name, lang)}</Label>
      <ButtonContainer>
        <Translate
          component={EditButton}
          type="button"
          onClick={() => edit(item.uiid)}
          attributes={{ 'aria-label': 'qvain.general.buttons.edit' }}
        />
        {!readonly && (
          <Translate
            component={DeleteButton}
            type="button"
            onClick={() => remove(item.uiid)}
            attribute={{ 'aria-label': 'qvain.general.buttons.remove' }}
          />
        )}
      </ButtonContainer>
    </FieldListContainer>
  ))
  return Elements
}

FieldList.propTypes = {
  Field: PropTypes.object.isRequired,
  lang: PropTypes.string.isRequired,
  translationsRoot: PropTypes.string.isRequired,
  disableNoItemsText: PropTypes.bool,
}

FieldList.defaultProps = {
  disableNoItemsText: false,
}

const FieldListContainer = styled(ButtonGroup)`
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

export default observer(FieldList)
