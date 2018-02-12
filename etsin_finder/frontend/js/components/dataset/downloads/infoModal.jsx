import React from 'react'
import Modal from 'react-modal'
import styled from 'styled-components'
import FileIcon from './fileIcon'

const ModalDescription = styled.p`
  color: #555;
`

const CloseModal = styled.button`
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

const Download = styled.button`
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

const ModalInfo = ({ name, id, title, size, category, type }) => (
  <ModalLayout>
    <ModalIcon>
      <FileIcon type={type} size="4x" transform="" />
    </ModalIcon>
    <InfoTable>
      <tbody>
        {!name ? null : (
          <tr>
            <th>Name</th>
            <td>{name}</td>
          </tr>
        )}
        {!id ? null : (
          <tr>
            <th>ID</th>
            <td>{id}</td>
          </tr>
        )}
        {type === 'dir' || !type ? null : (
          <tr>
            <th>Title</th>
            <td>{title}</td>
          </tr>
        )}
        {!size ? null : (
          <tr>
            <th>Size</th>
            <td>{size}</td>
          </tr>
        )}
        {!category ? null : (
          <tr>
            <th>Category</th>
            <td>{category}</td>
          </tr>
        )}
      </tbody>
    </InfoTable>
  </ModalLayout>
)

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

const InfoModal = ({ name, id, title, size, category, type, open, closeModal }) => {
  Modal.setAppElement('#root')
  return (
    <Modal
      isOpen={open}
      onRequestClose={closeModal}
      style={customStyles}
      contentLabel="Example Modal"
    >
      <CloseModal onClick={closeModal}>X</CloseModal>
      <ModalInfo name={name} id={id} title={title} size={size} category={category} type={type} />
      <ModalDescription>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt
        ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
        laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
        voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
        cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
      </ModalDescription>
      <Download className="btn btn-etsin">Download</Download>
    </Modal>
  )
}

export default InfoModal
