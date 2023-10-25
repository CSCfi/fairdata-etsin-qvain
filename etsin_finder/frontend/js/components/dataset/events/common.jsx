/**
 * This file is part of the Etsin service
 *
 * Copyright 2017-2021 Ministry of Education and Culture, Finland
 *
 *
 * @author    CSC - IT Center for Science Ltd., Espoo Finland <servicedesk@csc.fi>
 * @license   MIT
 */
import styled from 'styled-components'
import PropTypes from 'prop-types'

export const Table = styled.table`
  overflow-x: scroll;
  width: 100%;
  max-width: 100%;
  margin-bottom: 1rem;
  background-color: transparent;
  thead {
    background-color: ${props => props.theme.color.primary};
    color: white;
    tr > th {
      padding: 0.75rem;
      border: 0;
    }
  }
  tbody {
    box-sizing: border-box;
    border: 2px solid ${props => props.theme.color.lightgray};
    border-top: ${props => (props.noHead ? '' : 0)};
    tr:nth-child(odd) {
      background-color: ${props => props.theme.color.superlightgray};
    }
    tr:nth-child(even) {
      background-color: ${props => props.theme.color.white};
    }
    td {
      overflow-wrap: break-word;
      padding: 0.75rem;
    }
  }
`

export const ID = styled.span`
  margin-left: 0.2em;
  color: ${props => props.theme.color.darkgray};
  font-size: 0.9em;
`

export const IDLink = styled.a`
  margin-left: 0.2em;
  font-size: 0.9em;
`

export const OtherID = styled.li`
  margin: 0;
`

export const Margin = styled.section`
  margin: 1.5em 0em;
`

export const InlineUl = styled.ul`
  display: inline;
  margin: 0;
  padding: 0;
`

export const PreservationInfo = PropTypes.shape({
  isUseCopy: PropTypes.bool.isRequired,
  copyIdentifier: PropTypes.string, // identifier of the corresponding copy
  modified: PropTypes.string, // preservation_state_modified of the preservation version
  translationRoot: PropTypes.string,
})

export const getPreservationInfo = (
  Locale,
  { preservationDatasetOriginVersion, preservationStateModified, preservationDatasetVersion }
) => {
  const { dateFormat } = Locale
  let translationRoot, modified, copyIdentifier
  const isUseCopy = !preservationDatasetOriginVersion?.identifier
  if (isUseCopy) {
    translationRoot = 'dataset.events_idn.preservationEvent.useCopy'
    copyIdentifier = preservationDatasetVersion?.identifier
    modified = dateFormat(preservationDatasetVersion?.preservation_state_modified, {
      format: 'date',
    })
  } else {
    translationRoot = 'dataset.events_idn.preservationEvent.preservedCopy'
    copyIdentifier = preservationDatasetOriginVersion?.identifier
    modified = dateFormat(preservationStateModified, {
      format: 'date',
    })
  }
  return {
    isUseCopy,
    modified,
    copyIdentifier,
    translationRoot,
  }
}

export const hasProvenances = provenances => {
  if (provenances) {
    for (const provenance of provenances) {
      if (provenance.preservation_event || provenance.lifecycle_event) {
        return true
      }
      if (provenance.was_associated_with) {
        return true
      }
      if (provenance.temporal) {
        if (
          provenance.temporal.end_date &&
          provenance.temporal.end_date !== '' &&
          provenance.temporal.start_date &&
          provenance.temporal.start_date !== ''
        ) {
          return true
        }
      }
      if (provenance.description) {
        return true
      }
    }
  }
  return false
}
