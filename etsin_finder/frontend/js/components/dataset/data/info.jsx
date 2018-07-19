{
  /**
   * This file is part of the Etsin service
   *
   * Copyright 2017-2018 Ministry of Education and Culture, Finland
   *
   *
   * @author    CSC - IT Center for Science Ltd., Espoo Finland <servicedesk@csc.fi>
   * @license   MIT
   */
}

import React from 'react'
import styled from 'styled-components'
import Translate from 'react-translate-component'
import PropTypes from 'prop-types'

import checkDataLang from '../../../utils/checkDataLang'
import { Link } from '../../general/button'
import Modal from '../../general/modal'

const customStyles = {
  content: {
    minWidth: '35vw',
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
}) => (
  <Modal
    isOpen={open}
    onRequestClose={closeModal}
    customStyles={customStyles}
    contentLabel="Object info"
  >
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
      <FullButton
        href={accessUrl.identifier}
        title={checkDataLang(accessUrl.description)}
        noMargin
        target="_blank"
        rel="noopener noreferrer"
      >
        <Translate content="dataset.dl.go_to_original" />
      </FullButton>
    )}
    {downloadUrl && (
      <FullButton
        href={downloadUrl.identifier}
        target="_blank"
        rel="noopener noreferrer"
        title={checkDataLang(downloadUrl.description)}
        color="success"
        noMargin
      >
        <Translate content="dataset.dl.download" />
      </FullButton>
    )}
  </Modal>
)

export default Info

const ModalDescription = styled.div`
  & > strong > p {
    margin-bottom: 0.5em;
  }
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
  size: null,
}

Info.propTypes = {
  name: PropTypes.string.isRequired,
  id: PropTypes.string,
  title: PropTypes.string,
  size: PropTypes.string,
  category: PropTypes.string,
  type: PropTypes.string,
  open: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
  description: PropTypes.string,
  accessUrl: PropTypes.object,
  downloadUrl: PropTypes.object,
  checksum: PropTypes.object,
}
