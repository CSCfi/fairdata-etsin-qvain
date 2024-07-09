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
import { observer } from 'mobx-react'
import styled from 'styled-components'
import Translate from 'react-translate-component'
import PropTypes from 'prop-types'

import Modal from '@/components/general/modal'
import { useStores } from '@/utils/stores'
import CopyToClipboard from '../copyToClipboard'

const customStyles = {
  content: {
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    maxWidth: '800px',
  },
}

const Citation = ({ title, text }) => (
  <>
    <h2>{title}</h2>
    <p>{text}</p>
    <Justify>
      <CopyToClipboard
        content={text}
        label="dataset.citation.copyButton"
        tooltip="dataset.citation.copyButtonTooltip"
        tooltipSuccess="dataset.citation.copyButtonTooltipSuccess"
        tooltipPosition="left"
        horizontal
      />
    </Justify>
  </>
)

Citation.propTypes = {
  title: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
}

const CitationModal = () => {
  const {
    Etsin: {
      EtsinDataset: {
        dataset,
        showCitationModal,
        setShowCitationModal,
        citations: { apa, bibtex, chicago, mla },
      },
    },
  } = useStores()

  if (!dataset) {
    return null
  }

  return (
    <Modal
      isOpen={showCitationModal}
      customStyles={customStyles}
      onRequestClose={() => setShowCitationModal(false)}
      contentLabel="Citation Modal"
    >
      <Translate component="h1" content="dataset.citation.title" />
      <Grid>
        {dataset.bibliographic_citation && (
          <Translate
            component={Citation}
            attributes={{
              title: 'dataset.citation.recommended',
            }}
            text={dataset.bibliographic_citation}
          />
        )}
        <Citation title="APA" text={apa} />
        <Citation title="Chicago" text={chicago} />
        <Citation title="MLA" text={mla} />
        <Citation title="BibTeX" text={bibtex} />
      </Grid>
      <hr />
      <Translate component={Warning} content="dataset.citation.warning" />
    </Modal>
  )
}

const Warning = styled.p`
  margin-bottom: 0;
`

const Grid = styled.div`
  display: grid;
  gap: 0.25rem;
  margin-right: -1rem;
  padding-right: 1rem;
  overflow: auto;
  & h2 {
    line-height: 1.5;
    margin-bottom: 0;
    margin-top: 0.25em;
  }
  & p {
    margin-bottom: 0;
    background: ${p => p.theme.color.superlightgray};
    padding: 0.5rem 1rem;
    border-radius: 4px;
    white-space: pre-line;
    font-family: monospace;
  }
`

const Justify = styled.div`
  justify-self: right;
`

export default observer(CitationModal)
