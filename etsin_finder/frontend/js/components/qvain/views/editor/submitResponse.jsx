import React, { useState } from 'react'
import PropTypes from 'prop-types'
import styled, { keyframes } from 'styled-components'
import { observer } from 'mobx-react'
import Translate from 'react-translate-component'
import { withRouter } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'

import Loader from '../../../general/loader'
import { LinkButtonDarkGray } from '../../../general/button'
import { useStores } from '../../utils/stores'

const SubmitResponse = ({ history, response }) => {
  const {
    Qvain: { original },
    Env: { getEtsinUrl, getQvainUrl },
  } = useStores()
  const [clearSubmitResponse, setClearSubmitResponse] = useState(false)

  const getPreferredIdentifier = () => {
    let identifier
    if (response.state === 'published') {
      identifier = response.research_dataset && response.research_dataset.preferred_identifier
    }
    identifier = identifier || response.identifier
    return identifier
  }

  const handleOpenNewVersion = identifier => {
    history.push(getQvainUrl(`/dataset/${identifier}`))
    closeSubmitResponse()
  }

  const closeSubmitResponse = () => {
    setClearSubmitResponse(true)
  }

  // If the user wants to clear the submitResponse
  if (clearSubmitResponse) {
    setClearSubmitResponse(false)
    return null
  }

  let goToEtsin = <Translate content="qvain.datasets.goToEtsin" />
  let goToEtsinQuery = ''

  if (original && original.state === 'draft') {
    goToEtsin = <Translate content="qvain.datasets.goToEtsinDraft" />
    goToEtsinQuery = '?preview=1'
  }

  // If a new dataset or draft has been created successfully.
  if (
    response &&
    typeof response === 'object' &&
    'identifier' in response &&
    !('new_version_created' in response) &&
    (response.is_new || response.is_draft)
  ) {
    const identifier = response.identifier
    return (
      <ResponseContainerSuccess>
        <ResponseContainerContent>
          <ResponseLabel success>
            <Translate
              content={`qvain.submitStatus.${response.is_draft ? 'draftSuccess' : 'success'}`}
            />
          </ResponseLabel>
          <LinkToEtsin
            onClick={() =>
              window.open(getEtsinUrl(`/dataset/${identifier}${goToEtsinQuery}`), '_blank')
            }
          >
            {goToEtsin}
          </LinkToEtsin>
          <p>Identifier: {getPreferredIdentifier()}</p>
        </ResponseContainerContent>
        <ResponseContainerCloseButtonContainer>
          <LinkButtonDarkGray type="button" onClick={closeSubmitResponse}>
            <FontAwesomeIcon icon={faTimes} aria-hidden />
          </LinkButtonDarkGray>
        </ResponseContainerCloseButtonContainer>
      </ResponseContainerSuccess>
    )
  }
  // If an existing datasets metadata has successfully been updated.
  if (
    response &&
    typeof response === 'object' &&
    'identifier' in response &&
    !('new_version_created' in response) &&
    original !== undefined &&
    response.research_dataset !== undefined &&
    'metadata_version_identifier' in response.research_dataset &&
    'metadata_version_identifier' in original.research_dataset &&
    response.metadata_version_identifier !== original.research_dataset.metadata_version_identifier
  ) {
    const identifier = response.identifier
    return (
      <ResponseContainerSuccess>
        <ResponseContainerContent>
          <ResponseLabel success>
            <Translate
              content={
                response.is_draft
                  ? 'qvain.submitStatus.draftSuccess'
                  : 'qvain.submitStatus.editMetadataSuccess'
              }
            />
          </ResponseLabel>
          <LinkToEtsin
            onClick={() =>
              window.open(getEtsinUrl(`/dataset/${identifier}${goToEtsinQuery}`), '_blank')
            }
          >
            {goToEtsin}
          </LinkToEtsin>
          <p>Identifier: {getPreferredIdentifier()}</p>
        </ResponseContainerContent>
        <ResponseContainerCloseButtonContainer>
          <LinkButtonDarkGray type="button" onClick={closeSubmitResponse}>
            <FontAwesomeIcon icon={faTimes} aria-hidden />
          </LinkButtonDarkGray>
        </ResponseContainerCloseButtonContainer>
      </ResponseContainerSuccess>
    )
  }
  // Only in Metax V1:
  // If an existing datasets files or directorys have changed and the update automatically
  // creates a new version of the dataset with its own identifiers.
  if (response && typeof response === 'object' && 'new_version_created' in response) {
    const identifier = response.dataset_version_set
      ? response.dataset_version_set[0].identifier
      : response.identifier
    return (
      <ResponseContainerSuccess>
        <ResponseContainerContent>
          <ResponseLabel success>
            <Translate content="qvain.submitStatus.editFilesSuccess" />
          </ResponseLabel>
          <LinkToEtsin
            onClick={() => handleOpenNewVersion(response.new_version_created.identifier)}
          >
            <Translate content="qvain.datasets.openNewVersion" />
          </LinkToEtsin>
          <LinkToEtsin
            onClick={() =>
              window.open(getEtsinUrl(`/dataset/${identifier}${goToEtsinQuery}`), '_blank')
            }
          >
            {goToEtsin}
          </LinkToEtsin>
          <p>Identifier: {identifier}</p>
        </ResponseContainerContent>
        <ResponseContainerCloseButtonContainer>
          <LinkButtonDarkGray type="button" onClick={closeSubmitResponse}>
            <FontAwesomeIcon icon={faTimes} aria-hidden />
          </LinkButtonDarkGray>
        </ResponseContainerCloseButtonContainer>
      </ResponseContainerSuccess>
    )
  }
  // If something went wrong.
  if (response) {
    return (
      <ResponseContainerError>
        <ResponseContainerContent>
          <ResponseLabel>
            <Translate content="qvain.submitStatus.fail" />
          </ResponseLabel>
          <p>{response.toString().replace(/,/g, '\n')}</p>
        </ResponseContainerContent>
        <ResponseContainerCloseButtonContainer>
          <LinkButtonDarkGray type="button" onClick={closeSubmitResponse}>
            <FontAwesomeIcon icon={faTimes} aria-hidden />
          </LinkButtonDarkGray>
        </ResponseContainerCloseButtonContainer>
      </ResponseContainerError>
    )
  }

  return (
    <ResponseContainerLoading>
      <Loader active />
    </ResponseContainerLoading>
  )
}

SubmitResponse.propTypes = {
  history: PropTypes.object.isRequired,
  response: PropTypes.oneOfType([PropTypes.string, PropTypes.object, PropTypes.array]),
}

SubmitResponse.defaultProps = {
  response: null,
}

const LinkToEtsin = styled.button`
  color: green;
  display: inline-block;
  vertical-align: top;
  text-decoration: underline;
  margin-left: 10px;
  margin-bottom: 0px;
  margin-top: 2.5px;
  cursor: pointer;
  border: none;
  background-color: transparent;
`
const ResponseLabel = styled.p`
  font-weight: bold;
  display: inline-block;
  vertical-align: top;
`
const ResponseContainerSuccess = styled.div`
  background-color: #e8ffeb;
  text-align: center;
  width: 100%;
  color: green;
  z-index: 2;
  border-bottom: 1px solid rgba(0, 0, 0, 0.3);
`
const ResponseContainerLoading = styled.div`
  background-color: #fff;
  text-align: center;
  width: 100%;
  z-index: 2;
  height: 105px;
  padding-top: 30px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.3);
`
const FadeInAnimation = keyframes`
  from {
    color: #FFEBE8;
  }
  to {
    color: ${props => props.theme.color.redText};
  }
`
const ResponseContainerError = styled.div`
  background-color: #ffebe8;
  text-align: center;
  width: 100%;
  color: ${props => props.theme.color.redText};
  z-index: 2;
  border-bottom: 1px solid rgba(0, 0, 0, 0.3);
  animation-name: ${FadeInAnimation};
  animation-duration: 1.5s;
`
const ResponseContainerContent = styled.div`
  max-width: 1140px;
  width: 100%;
  text-align: left;
  display: inline-block;
  padding-left: 30px;
  padding-top: 20px;
  white-space: pre-line;
`
const ResponseContainerCloseButtonContainer = styled.div`
  right: 0;
  display: inline-block;
  text-align: right;
  padding-top: 10px;
  padding-right: 20px;
  position: absolute;
`
export default withRouter(observer(SubmitResponse))
