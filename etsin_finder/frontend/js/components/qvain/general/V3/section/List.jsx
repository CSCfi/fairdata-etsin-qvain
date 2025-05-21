import PropTypes from 'prop-types'
import styled from 'styled-components'
import { observer } from 'mobx-react'
import Translate from '@/utils/Translate'

import { useStores } from '@/stores/stores'

import {
  ButtonGroup,
  ButtonLabel,
  ListItemButtonContainer,
  EditButton,
  DeleteButton,
} from '../../V2/buttons'

const List = ({ model, disableEdit, disableNoItemsText }) => {
  const {
    Locale: { getValueTranslation },
    Qvain: { readonly },
  } = useStores()

  const {
    storage,
    translationPath,
    controller: { edit, remove },
  } = model

  const editButton = item => (
    <Translate
      key="project-edit-button"
      component={EditButton}
      type="button"
      onClick={() => edit(item.itemId)}
      attributes={{ 'aria-label': 'qvain.general.buttons.edit' }}
    />
  )

  const deleteButton = item => (
    <Translate
      component={DeleteButton}
      type="button"
      onClick={() => remove(item.itemId)}
      attributes={{ 'aria-label': 'qvain.general.buttons.remove' }}
    />
  )

  if (!storage?.length) {
    if (disableNoItemsText) return null
    return <Translate component="div" content={`${translationPath}.noItems`} />
  }

  return storage.map(item => (
    <FieldListContainer key={item.itemId}>
      <FieldListLabel className="item-label">{getValueTranslation(item.getLabel())}</FieldListLabel>
      <ListItemButtonContainer>
        {!disableEdit && editButton(item)}
        {!readonly && deleteButton(item)}
      </ListItemButtonContainer>
    </FieldListContainer>
  ))
}

List.propTypes = {
  model: PropTypes.object.isRequired,
  disableNoItemsText: PropTypes.bool,
  disableEdit: PropTypes.bool,
}

List.defaultProps = {
  disableNoItemsText: false,
  disableEdit: false,
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

export default observer(List)
