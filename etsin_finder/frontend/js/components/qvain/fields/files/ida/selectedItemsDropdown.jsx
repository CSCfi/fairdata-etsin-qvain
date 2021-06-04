import React from 'react'
import PropTypes from 'prop-types'
import Translate from 'react-translate-component'
import { faPen } from '@fortawesome/free-solid-svg-icons'

import { Dropdown, DropdownItem } from '../../../../general/dropdown'
import { hasMetadata, hasPASMetadata } from '../../../../../stores/view/common.files.items'
import { isFile, ClickableIcon } from '../../../../general/files/items'

import { useStores } from '../../../utils/stores'

const EditDropdown = ({ item, parentArgs }) => {
  const {
    Qvain: {
      Files: { clearMetadata, toggleInEdit, userHasRightsToEditProject },
      readonly,
      setMetadataModalFile,
      setClearMetadataModalFile,
    },
  } = useStores()

  const { parentAdded, parentRemoved } = parentArgs
  const itemHasPASMetadata = hasPASMetadata(item)
  const hasAddedChildren = item.type === 'directory' && item.addedChildCount > 0
  const isRemoved =
    (item.removed || (parentRemoved && !item.added)) && !hasAddedChildren && item.existing
  const name = item.name

  let canEdit =
    (item.added || item.existing || hasAddedChildren || parentAdded) && userHasRightsToEditProject
  if (isRemoved) {
    canEdit = false
  }

  const itemHasMetadata = hasMetadata(item)

  const BaseDropdown = ({ children }) => {
    const editColor = itemHasMetadata ? 'primary' : 'gray'
    let disabledEditColor = itemHasMetadata ? 'error' : 'gray'

    if (readonly) {
      disabledEditColor = 'gray'
    }

    return (
      <Dropdown
        buttonComponent={ClickableIcon}
        buttonProps={{
          icon: faPen,
          color: editColor,
          disabledColor: disabledEditColor,
          disabledOpacity: 0.4,
          attributes: { 'aria-label': 'qvain.files.selected.buttons.edit' },
        }}
        with={{ name }}
      >
        {children}
      </Dropdown>
    )
  }

  const MetadataButton = ({ type }) => (
    <Translate
      component={DropdownItem}
      content={`qvain.files.selected.${type}UserMetadata`}
      onClick={() => toggleInEdit(item)}
    />
  )

  const RemoveMetadataButton = () => (
    <Translate
      component={DropdownItem}
      content="qvain.files.selected.deleteUserMetadata"
      onClick={() => clearMetadata(item)}
      danger
    />
  )

  const PasButtons = () => {
    const showPasModal = () => {
      setMetadataModalFile(item)
    }

    const showClearPasModal = () => {
      setClearMetadataModalFile(item)
    }

    return (
      isFile(item) && (
        <>
          <Translate
            component={DropdownItem}
            content={`qvain.files.metadataModal.buttons.${
              itemHasPASMetadata || !canEdit ? 'show' : 'add'
            }`}
            onClick={showPasModal}
          />
          <Translate
            component={DropdownItem}
            content="qvain.files.metadataModal.buttons.delete"
            onClick={showClearPasModal}
            danger
            disabled={(readonly || !itemHasPASMetadata) && !canEdit}
          />
        </>
      )
    )
  }

  BaseDropdown.propTypes = {
    children: PropTypes.node.isRequired,
  }

  MetadataButton.propTypes = {
    type: PropTypes.string.isRequired,
  }

  if (!canEdit && !itemHasMetadata) return null
  if (!canEdit && itemHasMetadata)
    return (
      <BaseDropdown>
        <MetadataButton type="show" />
        {PasButtons()}
      </BaseDropdown>
    )
  if (itemHasMetadata)
    return (
      <BaseDropdown>
        <MetadataButton type="edit" />
        {PasButtons()}
      </BaseDropdown>
    )
  return (
    <BaseDropdown>
      <MetadataButton type="add" />
      <RemoveMetadataButton />
      {PasButtons()}
    </BaseDropdown>
  )
}

EditDropdown.propTypes = {
  item: PropTypes.object.isRequired,
  parentArgs: PropTypes.object.isRequired,
}

export default EditDropdown
