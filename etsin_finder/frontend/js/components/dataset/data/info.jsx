import React from 'react'
import Modal from 'react-modal'
import styled from 'styled-components'
import Translate from 'react-translate-component'
import PropTypes from 'prop-types'

import FileIcon from './fileIcon'
import Button, { TransparentButton } from '../../general/button'

const customStyles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
  },
  content: {
    top: '0',
    bottom: '0',
    left: '0',
    right: '0',
    position: 'relative',
    maxHeight: '80vh',
    minWidth: '20vw',
    maxWidth: '600px',
    margin: '0.5em',
    padding: '3em',
  },
}

export const ModalInfo = ({ name, id, title, size, category, type }) => (
  <ModalLayout>
    <ModalIcon>
      <FileIcon type={type} size="4x" transform="" />
    </ModalIcon>
    <InfoTable>
      <tbody>
        {name && (
          <tr>
            <th>Name</th>
            <td>{name}</td>
          </tr>
        )}
        {id && (
          <tr>
            <th>ID</th>
            <td>{id}</td>
          </tr>
        )}
        {title &&
          type !== 'dir' && (
            <tr>
              <th>Title</th>
              <td>{title}</td>
            </tr>
          )}
        {size && (
          <tr>
            <th>Size</th>
            <td>{size}</td>
          </tr>
        )}
        {category && (
          <tr>
            <th>Category</th>
            <td>{category}</td>
          </tr>
        )}
      </tbody>
    </InfoTable>
  </ModalLayout>
)

const Info = ({ name, id, title, size, category, type, open, closeModal, description }) => {
  Modal.setAppElement('#root')
  return (
    <Modal
      isOpen={open}
      onRequestClose={closeModal}
      style={customStyles}
      contentLabel="Object info"
    >
      <CloseModal onClick={closeModal}>X</CloseModal>
      <ModalInfo name={name} id={id} title={title} size={size} category={category} type={type} />
      {description ? (
        <div>
          <Translate content="general.description" component="h4" />
          <ModalDescription>{description}</ModalDescription>
        </div>
      ) : null}
      <Download noMargin>Download</Download>
    </Modal>
  )
}

export default Info

const ModalDescription = styled.p`
  color: #555;
  margin-bottom: 2em;
`

const CloseModal = styled(TransparentButton)`
  background: transparent;
  border: none;
  position: absolute;
  top: 0.5em;
  right: 0.5em;
`

const ModalLayout = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 2em;
  flex-wrap: wrap;
`

const ModalIcon = styled.div`
  padding: 1em;
  margin-left: 3em;
  margin-right: 3em;
  @media (max-width: 600px) {
    margin-left: 0em;
    font-size: 0.7em;
  }
`

const Download = styled(Button)`
  width: 100%;
`

const InfoTable = styled.table`
  th {
    padding: 0.2em 1em 0.2em 0em;
  }
  td {
    padding: 0.2em 0em 0.2em 1em;
  }
`

ModalInfo.defaultProps = {
  title: undefined,
  category: undefined,
  type: undefined,
}

ModalInfo.propTypes = {
  name: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  title: PropTypes.string,
  size: PropTypes.string.isRequired,
  category: PropTypes.string,
  type: PropTypes.string,
}

Info.defaultProps = {
  title: undefined,
  category: undefined,
  type: undefined,
  description: '',
}

Info.propTypes = {
  name: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  title: PropTypes.string,
  size: PropTypes.string.isRequired,
  category: PropTypes.string,
  type: PropTypes.string,
  open: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
  description: PropTypes.string,
}
