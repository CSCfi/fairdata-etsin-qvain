import PropTypes from 'prop-types'
import styled, { keyframes } from 'styled-components'
import { observer } from 'mobx-react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import Translate from '@/utils/Translate'

import Loader from '../../../general/loader'
import { LinkButtonDarkGray } from '../../../general/button'
import { useStores } from '../../utils/stores'

const SubmitResponse = ({ response, clearSubmitResponse }) => {
  const {
    Qvain: { original },
    Env: { getEtsinUrl },
    Locale: { translate },
  } = useStores()

  const getPreferredIdentifier = () => {
    if (response.state === 'published') {
      return response.research_dataset?.preferred_identifier
    }
    return null
  }

  let goToEtsin = <Translate content="qvain.datasets.actions.goToEtsin" />
  let goToEtsinQuery = ''

  if (original && original.state === 'draft') {
    goToEtsin = <Translate content="qvain.datasets.actions.goToEtsinDraft" />
    goToEtsinQuery = '?preview=1'
  }

  const identifier = response.identifier || response.id
  const isNew = response.is_new
  const isDraft = response.state === 'draft'

  // If a new dataset or draft has been created successfully.
  if (identifier && isNew) {
    return (
      <ResponseContainerSuccess>
        <ResponseContainerContent>
          <ResponseLabel>
            {translate(`qvain.submitStatus.${isDraft ? 'draftSuccess' : 'success'}`)}
          </ResponseLabel>
          <LinkToEtsin
            href={getEtsinUrl(`/dataset/${identifier}${goToEtsinQuery}`)}
            target="_blank"
          >
            {goToEtsin}
          </LinkToEtsin>
          <p>Identifier: {getPreferredIdentifier() || identifier}</p>
        </ResponseContainerContent>
        <ResponseContainerCloseButtonContainer>
          <LinkButtonDarkGray type="button" onClick={clearSubmitResponse}>
            <FontAwesomeIcon icon={faTimes} aria-hidden />
          </LinkButtonDarkGray>
        </ResponseContainerCloseButtonContainer>
      </ResponseContainerSuccess>
    )
  }

  // If an existing datasets metadata has successfully been updated.
  if (identifier) {
    return (
      <ResponseContainerSuccess>
        <ResponseContainerContent>
          <ResponseLabel>
            {translate(
              isDraft ? 'qvain.submitStatus.draftSuccess' : 'qvain.submitStatus.editMetadataSuccess'
            )}
          </ResponseLabel>
          <LinkToEtsin
            href={getEtsinUrl(`/dataset/${identifier}${goToEtsinQuery}`)}
            target="_blank"
          >
            {goToEtsin}
          </LinkToEtsin>
          <p>Identifier: {getPreferredIdentifier() || identifier}</p>
        </ResponseContainerContent>
        <ResponseContainerCloseButtonContainer>
          <LinkButtonDarkGray type="button" onClick={clearSubmitResponse}>
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
          <ResponseLabel>{translate('qvain.submitStatus.fail')}</ResponseLabel>
          <p>{response.toString().replace(/,/g, '\n')}</p>
        </ResponseContainerContent>
        <ResponseContainerCloseButtonContainer>
          <LinkButtonDarkGray type="button" onClick={clearSubmitResponse}>
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
  clearSubmitResponse: PropTypes.func.isRequired,
  response: PropTypes.oneOfType([PropTypes.string, PropTypes.object, PropTypes.array]),
}

SubmitResponse.defaultProps = {
  response: null,
}

const LinkToEtsin = styled.a`
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
export default observer(SubmitResponse)
