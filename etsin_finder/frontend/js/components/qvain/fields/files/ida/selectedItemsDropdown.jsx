import React from 'react'
import PropTypes from 'prop-types'
import Translate from 'react-translate-component'
import { faPen, faEye } from '@fortawesome/free-solid-svg-icons'
import { observer } from 'mobx-react'

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
    let icon = faPen
    let ariaLabel = 'qvain.files.selected.buttons.edit'

    if (readonly || !userHasRightsToEditProject) {
      disabledEditColor = 'gray'
      icon = faEye
      ariaLabel = 'qvain.files.selected.buttons.show'
    }

    return (
      <Dropdown
        buttonComponent={ClickableIcon}
        buttonProps={{
          icon,
          color: editColor,
          disabledColor: disabledEditColor,
          disabledOpacity: 0.4,
          attributes: { 'aria-label': ariaLabel },
        }}
        align="right"
        with={{ name }}
      >
        {children}
      </Dropdown>
    )
  }

  const MetadataButton = ({ type }) => (
    <Translate
      className={`${type}-user-metadata`}
      component={DropdownItem}
      content={`qvain.files.selected.${type}UserMetadata`}
      onClick={() => toggleInEdit(item)}
    />
  )

  const RemoveMetadataButton = () => (
    <Translate
      className="remove-user-metadata"
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

    let pasOption
    if (readonly || !canEdit || !userHasRightsToEditProject) pasOption = 'show'
    else if (itemHasPASMetadata) pasOption = 'edit'
    else pasOption = 'add'

    return (
      isFile(item) && (
        <>
          <Translate
            className={`${pasOption}-pas-metadata`}
            component={DropdownItem}
            content={`qvain.files.metadataModal.buttons.${pasOption}`}
            onClick={showPasModal}
          />
          {!readonly && itemHasPASMetadata && userHasRightsToEditProject && (
            <Translate
              className={`remove-pas-metadata`}
              component={DropdownItem}
              content="qvain.files.metadataModal.buttons.delete"
              onClick={showClearPasModal}
              danger
            />
          )}
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

  if (!canEdit && !itemHasMetadata && !isFile(item)) return null
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
        <RemoveMetadataButton />
        {PasButtons()}
      </BaseDropdown>
    )
  if (!canEdit && !itemHasMetadata && isFile(item))
    return <BaseDropdown>{PasButtons()}</BaseDropdown>
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

export default observer(EditDropdown)
