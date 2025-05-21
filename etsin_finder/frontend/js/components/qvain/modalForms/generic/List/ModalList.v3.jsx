import styled from 'styled-components'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'
import Translate from '@/utils/Translate'
import {
  ButtonGroup,
  ButtonLabel,
  DeleteButton,
  ListItemButtonContainer,
} from '@/components/qvain/general/V2/buttons'
import { useStores } from '@/stores/stores'

const ModalList = ({ model, disableNoItemsText, changeCallback }) => {
  const {
    Locale: { getValueTranslation },
    Qvain: { readonly },
  } = useStores()

  const {
    translationPath,
    storage,
    controller: { remove },
  } = model

  if (!storage?.length) {
    if (disableNoItemsText) return null
    return <Translate component="div" content={`${translationPath}.noItems`} />
  }

  return storage.map(item => (
    <FieldListContainer key={item.itemId}>
      <FieldListLabel className="item-label">{getValueTranslation(item.getLabel())}</FieldListLabel>
      <ListItemButtonContainer>
        {!readonly && (
          <Translate
            component={DeleteButton}
            type="button"
            onClick={() => {
              remove(item.itemId)
              changeCallback()
            }}
            attributes={{ 'aria-label': 'qvain.general.buttons.remove' }}
          />
        )}
      </ListItemButtonContainer>
    </FieldListContainer>
  ))
}

ModalList.propTypes = {
  model: PropTypes.object.isRequired,
  disableNoItemsText: PropTypes.bool,
  changeCallback: PropTypes.func,
}

ModalList.defaultProps = {
  disableNoItemsText: false,
  changeCallback: () => {},
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

export default observer(ModalList)
