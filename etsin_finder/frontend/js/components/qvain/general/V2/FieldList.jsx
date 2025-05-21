import PropTypes from 'prop-types'
import { observer } from 'mobx-react'
import { useStores } from '@/stores/stores'
import ModalFieldList from './ModalFieldList'

const FieldList = ({ fieldName, disableNoItemsText }) => {
  const {
    Qvain: {
      [fieldName]: { remove, edit, storage, readonly, translationsRoot, getItemLabel },
    },
  } = useStores()

  return (
    <ModalFieldList
      storage={storage}
      remove={remove}
      edit={edit}
      readonly={readonly}
      translationsRoot={translationsRoot}
      disableNoItemsText={disableNoItemsText}
      nameGetter={getItemLabel}
    />
  )
}

FieldList.propTypes = {
  fieldName: PropTypes.string.isRequired,
  disableNoItemsText: PropTypes.bool,
}

FieldList.defaultProps = {
  disableNoItemsText: false,
}

export default observer(FieldList)
