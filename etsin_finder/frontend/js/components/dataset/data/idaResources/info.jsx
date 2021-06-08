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

import InfoItem from '../infoItem'
import checkDataLang, { getDataLang } from '../../../../utils/checkDataLang'
import Modal from '../../../general/modal'
import { TypeConcept, TypeChecksum } from '../../../../utils/propTypes'

const customStyles = {
  content: {
    minWidth: '16rem',
    maxWidth: '80vw',
    padding: '1rem',
  },
}

const formatChecksum = checksum => {
  if (!checksum || !checksum.value) {
    return ''
  }
  const parts = [checksum.value]
  if (checksum.algorithm) {
    parts.push(`(${checksum.algorithm})`)
  }
  return parts.join(' ')
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
  headerContent,
  headerIcon,
}) => (
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
          {name && <InfoItem translation="dataset.dl.name" content={name} />}
          {id && <InfoItem translation="dataset.dl.id" content={id} />}
          {size && <InfoItem translation="dataset.dl.size" content={size} />}
          {checksum && (
            <InfoItem translation="dataset.dl.checksum" content={formatChecksum(checksum)} />
          )}
        </tbody>
      </InfoTable>

      {(type || title || category || description) && (
        <>
          <Translate component={SubHeader} content="dataset.dl.customMetadata" />
          <InfoTable>
            <tbody>
              {type && type !== 'dir' && (
                <InfoItem
                  translation="dataset.dl.type"
                  content={checkDataLang(type.pref_label) || type}
                  lang={getDataLang(type.pref_label)}
                />
              )}
              {title && <InfoItem translation="dataset.dl.title" content={title} />}
              {category && <InfoItem translation="dataset.dl.category" content={category} />}
              {description && <InfoItem translation="general.description" content={description} />}
            </tbody>
          </InfoTable>
        </>
      )}
    </ModalLayout>
  </Modal>
)

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
  checksum: TypeChecksum,
  headerContent: PropTypes.string,
  headerIcon: PropTypes.object,
}
