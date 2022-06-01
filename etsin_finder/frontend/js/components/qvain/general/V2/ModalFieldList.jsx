import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import Translate from 'react-translate-component'
import { observer } from 'mobx-react'
import {
  ButtonGroup,
  ButtonLabel,
  EditButton,
  DeleteButton,
  ListItemButtonContainer,
} from './buttons'
import { useStores } from '@/stores/stores'

const FieldList = ({ storage, edit, remove, readonly, translationsRoot, disableNoItemsText }) => {
  const {
    Locale: { getValueTranslation, lang },
  } = useStores()

  if (!storage.length) {
    if (disableNoItemsText) return null
    return <Translate component="div" content={`${translationsRoot}.noItems`} />
  }

  return storage.map(item => (
    <FieldListContainer key={item.uiid}>
      <FieldListLabel>{getValueTranslation(item.name || item.title, lang)}</FieldListLabel>
      <ListItemButtonContainer>
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
      </ListItemButtonContainer>
    </FieldListContainer>
  ))
}

FieldList.propTypes = {
  storage: PropTypes.array.isRequired,
  edit: PropTypes.func.isRequired,
  remove: PropTypes.func.isRequired,
  readonly: PropTypes.bool.isRequired,
  translationsRoot: PropTypes.string.isRequired,
  disableNoItemsText: PropTypes.bool,
}

FieldList.defaultProps = {
  disableNoItemsText: false,
}

export const FieldListContainer = styled(ButtonGroup)`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

export const FieldListLabel = styled(ButtonLabel)`
  white-space: normal;
  overflow: hidden;
  height: auto;
  word-break: break-word;
`

export default observer(FieldList)
