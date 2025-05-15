import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'
import Translate from '@/utils/Translate'
import {
  ButtonGroup,
  ButtonLabel,
  EditButton,
  DeleteButton,
  ListItemButtonContainer,
} from './buttons'
import { useStores } from '@/stores/stores'

const ModalFieldList = ({
  storage,
  edit,
  remove,
  readonly,
  translationsRoot,
  disableNoItemsText,
  nameGetter,
}) => {
  const {
    Locale: { getValueTranslation, lang },
  } = useStores()

  if (!storage.length) {
    if (disableNoItemsText) return null
    return <Translate component="div" content={`${translationsRoot}.noItems`} />
  }

  return storage.map(item => (
    <FieldListContainer key={item.uiid}>
      <FieldListLabel className="item-label">{getValueTranslation(nameGetter(item), lang)}</FieldListLabel>
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
            attributes={{ 'aria-label': 'qvain.general.buttons.remove' }}
          />
        )}
      </ListItemButtonContainer>
    </FieldListContainer>
  ))
}

ModalFieldList.propTypes = {
  storage: PropTypes.array.isRequired,
  edit: PropTypes.func.isRequired,
  remove: PropTypes.func.isRequired,
  readonly: PropTypes.bool.isRequired,
  translationsRoot: PropTypes.string.isRequired,
  disableNoItemsText: PropTypes.bool,
  nameGetter: PropTypes.func,
}

ModalFieldList.defaultProps = {
  disableNoItemsText: false,
  nameGetter: v => v.name || v.title,
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

export default observer(ModalFieldList)
