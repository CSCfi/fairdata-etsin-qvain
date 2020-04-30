import React from 'react';
import PropTypes from 'prop-types';
import { inject, Observer } from 'mobx-react'
import Translate from 'react-translate-component'
import styled from 'styled-components';

import ProjectSelector from './projectSelector'
import Modal from '../../../general/modal'
import AddItemsTree from './addItemsTree'
import { SaveButton, CancelButton } from '../../general/buttons'
import { HelpField } from '../../general/form'


export function AddFilesModal(props) {
  const { isOpen, onRequestClose } = props

  const Files = props.Stores.Qvain.Files

  const saveAddedItems = () => {
    const { getTopmostChecked, clearChecked } = Files.AddItemsView
    const selected = getTopmostChecked()
    selected.forEach(item => { Files.addItem(item) })
    clearChecked()
    onRequestClose()
  }

  const render = () => {
    const { isCumulative, original } = props.Stores.Qvain
    const isPublished = !!original
    const projectChosen = Files.root && (Files.root.addedChildCount > 0 || Files.root.selectedChildCount > 0 || Files.root.removedChildCount > 0)
    const haveNewFiles = Object.values(Files.AddItemsView.checkedState).some(item => item)

    return (
      <Modal contentLabel="addItemsModal" isOpen={isOpen} customStyles={modalStyle} onRequestClose={onRequestClose}>
        <Header>
          <Translate component={Title} content="qvain.files.addItemsModal.title" />
          <ProjectSelector disabled={projectChosen} />
        </Header>
        <AddItemsTree onRequestClose={onRequestClose} />
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

  return (
    <Observer>{() => render()}</Observer>
  )
}

AddFilesModal.propTypes = {
  Stores: PropTypes.object.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onRequestClose: PropTypes.func.isRequired
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
    maxWidth: '600px',
    margin: '0.5em',
    border: 'none',
    padding: '2em',
    boxShadow: '0px 6px 12px -3px rgba(0, 0, 0, 0.15)',
    overflow: 'hidden',
    paddingLeft: '2em',
    paddingRight: '2em',
    display: 'flex',
    flexDirection: 'column'
  }
}


const Buttons = styled.div`
  display: flex;
  padding: 0 0 0 0;
  margin: -0.25rem;
  margin-top: 0.5rem;
  > * {
    margin: 0.25rem;
  }
`

const Header = styled.div`{
  margin-right: 1.5rem;
  margin-top: -0.5rem;
  margin-bottom: 0.5rem;
  margin-left: 0rem;
}`

const Title = styled.h3`{
  display: inline-block;
  margin-right: 0.5em;
  margin-bottom: 0;
}`


export default inject('Stores')(AddFilesModal)
