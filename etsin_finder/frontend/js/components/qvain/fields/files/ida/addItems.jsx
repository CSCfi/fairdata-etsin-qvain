import React from 'react'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'
import Translate from 'react-translate-component'
import styled from 'styled-components'

import ProjectSelector from './projectSelector'
import Modal from '../../../../general/modal'
import AddItemsTree from './addItemsTree'
import { SaveButton, CancelButton } from '../../../general/buttons'
import { HelpField } from '../../../general/modal/form'
import { useStores } from '../../../utils/stores'

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
      original,
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

  const isPublished = !!original
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
      {isPublished && !isCumulative && (
        <Translate component={HelpField} content="qvain.files.addItemsModal.versionInfo" />
      )}
      <Buttons>
        <SaveButton onClick={saveAddedItems} disabled={!haveNewFiles}>
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
    top: '0',
    bottom: '0',
    left: '0',
    right: '0',
    position: 'relative',
    minHeight: '80vh',
    height: '80vh',
    maxHeight: '80vh',
    minWidth: '300px',
    maxWidth: '800px',
    margin: '0.5em',
    border: 'none',
    padding: '2em',
    boxShadow: '0px 6px 12px -3px rgba(0, 0, 0, 0.15)',
    overflow: 'hidden',
    paddingLeft: '2em',
    paddingRight: '2em',
    display: 'flex',
    flexDirection: 'column',
  },
}

const TreeWrapper = styled.div`
  flex-grow: 1;
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
