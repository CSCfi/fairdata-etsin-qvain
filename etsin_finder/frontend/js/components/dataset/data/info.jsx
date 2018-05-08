import React from 'react'
import Modal from 'react-modal'
import styled from 'styled-components'
import Translate from 'react-translate-component'
import PropTypes from 'prop-types'

import { Link, TransparentButton } from '../../general/button'

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
    minWidth: '35vw',
    maxWidth: '600px',
    margin: '0.5em',
    padding: '3em',
  },
}

const Info = ({
  name,
  id,
  title,
  size,
  category,
  type,
  open,
  closeModal,
  description,
  checksum,
  accessUrl,
  downloadUrl,
}) => {
  Modal.setAppElement('#root')
  return (
    <Modal
      isOpen={open}
      onRequestClose={closeModal}
      style={customStyles}
      contentLabel="Object info"
    >
      <CloseModal onClick={closeModal}>
        <Translate className="sr-only" content="dataset.dl.close_modal" />
        <span aria-hidden>X</span>
      </CloseModal>
      <ModalLayout>
        <Translate className="sr-only" content="dataset.dl.info_header" />
        <InfoTable>
          <tbody>
            {name && (
              <tr>
                <th>
                  <Translate content="dataset.dl.name" />
                </th>
                <td>{name}</td>
              </tr>
            )}
            {id && (
              <tr>
                <th>
                  <Translate content="dataset.dl.id" />
                </th>
                <td>{id}</td>
              </tr>
            )}
            {title && (
              <tr>
                <th>
                  <Translate content="dataset.dl.title" />
                </th>
                <td>{title}</td>
              </tr>
            )}
            {type &&
              type !== 'dir' && (
                <tr>
                  <th>
                    <Translate content="dataset.dl.type" />
                  </th>
                  <td>{type}</td>
                </tr>
              )}
            {size && (
              <tr>
                <th>
                  <Translate content="dataset.dl.size" />
                </th>
                <td>{size}</td>
              </tr>
            )}
            {category && (
              <tr>
                <th>
                  <Translate content="dataset.dl.category" />
                </th>
                <td>{category}</td>
              </tr>
            )}
            {checksum && (
              <tr>
                <th>
                  <Translate content="dataset.dl.checksum" />
                </th>
                <td>{checksum.checksum_value}</td>
              </tr>
            )}
          </tbody>
        </InfoTable>
      </ModalLayout>
      {description ? (
        <ModalDescription>
          <strong>
            <Translate content="general.description" component="p" />
          </strong>
          <p>{description}</p>
        </ModalDescription>
      ) : null}
      {accessUrl && (
        <FullButton href={accessUrl} noMargin>
          <Translate content="dataset.dl.go_to_original" />
        </FullButton>
      )}
      {downloadUrl && (
        <FullButton href={downloadUrl} color="success" noMargin>
          <Translate content="dataset.dl.download" />
        </FullButton>
      )}
    </Modal>
  )
}

export default Info

const ModalDescription = styled.div`
  & > strong > p {
    margin-bottom: 0.5em;
  }
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
  margin-bottom: 0.5em;
  flex-wrap: wrap;
`

const FullButton = styled(Link)`
  margin-top: 0.6em;
  width: 100%;
`

const InfoTable = styled.table`
  width: 100%;
  th {
    padding: 0.2em 1em 0.2em 0em;
    width: 30%;
  }
  td {
    padding: 0.2em 0em 0.2em 1em;
  }
`

Info.defaultProps = {
  title: undefined,
  category: undefined,
  type: undefined,
  description: undefined,
  id: undefined,
  accessUrl: null,
  downloadUrl: null,
  checksum: null,
}

Info.propTypes = {
  name: PropTypes.string.isRequired,
  id: PropTypes.string,
  title: PropTypes.string,
  size: PropTypes.string.isRequired,
  category: PropTypes.string,
  type: PropTypes.string,
  open: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
  description: PropTypes.string,
  accessUrl: PropTypes.object,
  downloadUrl: PropTypes.object,
  checksum: PropTypes.object,
}
