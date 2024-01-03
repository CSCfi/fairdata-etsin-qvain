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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import InfoItem from './infoItem'
import Modal from '@/components/general/modal'
import { TypeConcept } from '@/utils/propTypes'
import { useStores } from '@/stores/stores'

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
  accessUrl,
  downloadUrl,
  open,
  closeModal,
  description,
  checksum,
  headerContent,
  headerIcon,
}) => {
  const {
    Locale: { getPreferredLang, getValueTranslation },
  } = useStores()

  let checksumParts, checksumAlgorithm, checksumValue
  if (checksum) {
    checksumParts = checksum.split(':')
    checksumAlgorithm = checksumParts[0]
    checksumValue = checksumParts[1]
  }

  return (
    <Modal
      isOpen={open}
      onRequestClose={closeModal}
      customStyles={customStyles}
      contentLabel="Object info"
    >
      <ModalLayout>
        {headerContent ? (
          <Header>
            {headerIcon && <HeaderIcon icon={headerIcon} />}
            <Translate content={headerContent} />
          </Header>
        ) : (
          <Translate className="sr-only" content="dataset.dl.info_header" />
        )}
        <InfoTable>
          <tbody>
            <InfoItem translation="dataset.dl.name" content={name} />
            <InfoItem translation="dataset.dl.id" content={id} />
            <InfoItem translation="dataset.dl.size" content={size} />
            <InfoItem
              translation="dataset.dl.checksum"
              content={checksumValue || null}
              insertable={checksumAlgorithm || ''}
            />
            <InfoItem translation="dataset.dl.accessUrl" content={accessUrl} />
            <InfoItem translation="dataset.dl.downloadUrl" content={downloadUrl} />
          </tbody>
        </InfoTable>

        {(type || title || category || description) && (
          <>
            <Translate component={SubHeader} content="dataset.dl.customMetadata" />
            <InfoTable>
              <tbody>
                <InfoItem translation="dataset.dl.title" content={getValueTranslation(title)} />
                {type !== 'dir' && (
                  <InfoItem
                    translation="dataset.dl.type"
                    lang={getPreferredLang(type?.pref_label)}
                    content={getValueTranslation(type?.pref_label) || type}
                  />
                )}
                <InfoItem translation="dataset.dl.category" content={category} />
                <InfoItem translation="general.description" content={description} />
              </tbody>
            </InfoTable>
          </>
        )}
      </ModalLayout>
    </Modal>
  )
}

export default Info

const Header = styled.h2`
  margin-right: 1em;
`

const SubHeader = styled.h3`
  margin-top: 0.5em;
  margin-bottom: 0;
`

const HeaderIcon = styled(FontAwesomeIcon)`
  margin-right: 0.5em;
`

const ModalLayout = styled.div`
  display: flex;
  margin-bottom: 0.5em;
  flex-direction: column;
  padding: 0 1rem;
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
  checksum: null,
  size: null,
  headerContent: '',
  headerIcon: null,
  accessUrl: null,
  downloadUrl: null,
}

Info.propTypes = {
  name: PropTypes.string.isRequired,
  open: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
  id: PropTypes.string,
  title: PropTypes.string,
  size: PropTypes.string,
  category: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  type: PropTypes.oneOfType([PropTypes.string, TypeConcept]),
  description: PropTypes.string,
  checksum: PropTypes.string,
  headerContent: PropTypes.string,
  headerIcon: PropTypes.object,
  accessUrl: PropTypes.string,
  downloadUrl: PropTypes.string,
}
