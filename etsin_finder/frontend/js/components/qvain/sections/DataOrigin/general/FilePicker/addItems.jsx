import React from 'react'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'
import Translate from 'react-translate-component'
import styled from 'styled-components'

import ProjectSelector from './projectSelector'
import Modal from '../../../../../general/modal'
import AddItemsTree from './addItemsTree'
import { SaveButton, CancelButton } from '../../../../general/buttons'
import { HelpField } from '../../../../general/modal/form'
import { useStores } from '../../../../utils/stores'

export const AddFilesModal = ({ isOpen, onRequestClose }) => {
  const {
    Qvain: {
      Files: {
        AddItemsView: { getTopmostChecked, clearChecked, checkedState },
        addItem,
        projectLocked,
        root,
      },
      isCumulative,
    },
  } = useStores()

  const saveAddedItems = () => {
    const selected = getTopmostChecked()
    selected.forEach(item => {
      addItem(item)
    })
    clearChecked()
    onRequestClose()
  }

  const getDatasetEditingInfoTranslation = () => {
    if (isCumulative) {
      return 'qvain.files.addItemsModal.versionInfo.published'
    }
    return 'qvain.files.addItemsModal.versionInfo.draft'
  }

  const projectChosen =
    projectLocked || (root && (root.addedChildCount > 0 || root.removedChildCount > 0))
  const haveNewFiles = Object.values(checkedState).some(item => item)

  return (
    <Modal
      contentLabel="addItemsModal"
      isOpen={isOpen}
      customStyles={modalStyle}
      onRequestClose={onRequestClose}
    >
      <Header>
        <Translate component={Title} content="qvain.files.addItemsModal.title" />
        <ProjectSelector disabled={projectChosen} />
      </Header>
      <TreeWrapper>
        <AddItemsTree onRequestClose={onRequestClose} />
      </TreeWrapper>
      <Translate component={HelpField} content={getDatasetEditingInfoTranslation()} />
      <Buttons>
        <SaveButton onClick={saveAddedItems} disabled={!haveNewFiles} data-cy="add-files">
          <Translate content={'qvain.files.addItemsModal.buttons.save'} />
        </SaveButton>
        <CancelButton onClick={onRequestClose}>
          <Translate content={'qvain.files.addItemsModal.buttons.close'} />
        </CancelButton>
      </Buttons>
    </Modal>
  )
}

AddFilesModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onRequestClose: PropTypes.func.isRequired,
}

const modalStyle = {
  content: {
    minHeight: '250px',
    height: '80vh',
    width: '800px',
    minWidth: '300px',
    maxWidth: '800px',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  },
}

const TreeWrapper = styled.div`
  flex-grow: 1;
  overflow: auto;
`

const Buttons = styled.div`
  display: flex;
  padding: 0 0 0 0;
  margin: -0.25rem;
  margin-top: 0.5rem;
  > * {
    margin: 0.25rem;
  }
`

const Header = styled.div`
  margin-right: 1.5rem;
  margin-top: -0.5rem;
  margin-bottom: 0.5rem;
  margin-left: 0rem;
`

const Title = styled.h3`
  display: inline-block;
  margin-right: 0.5em;
  margin-bottom: 0;
`

export default observer(AddFilesModal)
