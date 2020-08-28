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

import InfoItem from './infoItem'
import checkDataLang, { getDataLang } from '../../../utils/checkDataLang'
import { Link } from '../../general/button'
import Modal from '../../general/modal'
import { TypeConcept, TypeChecksum } from '../../../utils/propTypes'

const customStyles = {
  content: {
    minWidth: '16rem',
    maxWidth: '80vw',
    padding: '1rem',
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
  allowDownload,
  headerContent,
}) => (
  <Modal
    isOpen={open}
    onRequestClose={closeModal}
    customStyles={customStyles}
    contentLabel="Object info"
  >
    <ModalLayout>
      {headerContent ? (
        <Translate component="h2" content={headerContent} />
      ) : (
        <Translate className="sr-only" content="dataset.dl.info_header" />
      )}
      <InfoTable>
        <tbody>
          {name && <InfoItem translation="dataset.dl.name" content={name} />}
          {id && <InfoItem translation="dataset.dl.id" content={id} />}
          {size && <InfoItem translation="dataset.dl.size" content={size} />}
          {checksum && (checksum.checksum_value || checksum.value) && (
            <InfoItem
              translation="dataset.dl.checksum"
              content={checksum.checksum_value ? checksum.checksum_value : checksum.value}
            />
          )}
          {type && type !== 'dir' && (
            <InfoItem
              translation="dataset.dl.type"
              content={checkDataLang(type.pref_label) || type}
              lang={getDataLang(type.pref_label)}
            />
          )}
          {title && <InfoItem translation="dataset.dl.title" content={title} />}
          {category && <InfoItem translation="dataset.dl.category" content={category} />}
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
    {accessUrl && allowDownload && (
      <FullButton
        lang={getDataLang(accessUrl.description)}
        href={accessUrl.identifier}
        title={checkDataLang(accessUrl.description)}
        noMargin
        target="_blank"
        rel="noopener noreferrer"
      >
        <Translate content="dataset.dl.go_to_original" />
      </FullButton>
    )}
    {downloadUrl && allowDownload && (
      <FullButton
        href={downloadUrl.identifier}
        target="_blank"
        rel="noopener noreferrer"
        lang={getDataLang(downloadUrl.description)}
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
  headerContent: '',
}

Info.propTypes = {
  name: PropTypes.string.isRequired,
  id: PropTypes.string,
  title: PropTypes.string,
  size: PropTypes.string,
  category: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  type: PropTypes.oneOfType([PropTypes.string, TypeConcept]),
  open: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
  description: PropTypes.string,
  allowDownload: PropTypes.bool.isRequired,
  accessUrl: PropTypes.object,
  downloadUrl: PropTypes.object,
  checksum: TypeChecksum,
  headerContent: PropTypes.string,
}
