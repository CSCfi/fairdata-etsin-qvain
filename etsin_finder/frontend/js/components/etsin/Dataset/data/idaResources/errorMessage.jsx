import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import Translate from '@/utils/Translate'
import { useStores } from '@/stores/stores'
import { ACCESS_TYPE_URL } from '@/utils/constants'

const ACCESS_DENIED_MESSAGES = {
  EMBARGO: 'dataset.access_rights_description.embargo',
  LOGIN: 'dataset.access_rights_description.login',
  PERMIT: 'dataset.access_rights_description.permit',
  RESTRICTED: 'dataset.access_rights_description.restricted',
}

const ErrorMessage = () => {
  const {
    Etsin: {
      filesProcessor: { Packages },
      EtsinDataset: { accessRights, isDownloadAllowed },
    },
  } = useStores()

  const [showDetails, setShowDetails] = useState(false)

  const { error, clearError } = Packages

  const accessType = accessRights?.access_type?.url

  useEffect(() => {
    setShowDetails(false)
  }, [error])

  if (!error && isDownloadAllowed) {
    return null
  }

  let errorColor = null
  let allowDetails = true

  const statusCodeToErrorMessage = status => {
    switch (status) {
      case 500: {
        return 'unknownError'
      }
      case 503: {
        return 'idaUnavailable'
      }
      default: {
        return 'serviceUnavailable'
      }
    }
  }

  let summaryTranslation = `dataset.dl.errors.${statusCodeToErrorMessage(error?.response?.status)}`

  if (!isDownloadAllowed) {
    const reason = Object.keys(ACCESS_TYPE_URL).find(key => ACCESS_TYPE_URL[key] === accessType)
    if (reason in ACCESS_DENIED_MESSAGES) {
      summaryTranslation = ACCESS_DENIED_MESSAGES[reason]
      allowDetails = false
      errorColor = 'primary'
    } else {
      return null // Unknown reason, e.g. catalog does not allow downloads
    }
  }

  const detailAction = `error.details.${showDetails ? 'hideDetails' : 'showDetails'}`

  const message = `${error?.name}: ${error?.message}`
  const response = error?.request?.responseText
  return (
    <ErrorDiv errorColor={errorColor}>
      <Message style={{ flexGrow: 1 }}>
        <Translate component={MessagePart} content={summaryTranslation} unsafe />
        {allowDetails && (
          <>
            {showDetails && message && <MessagePart>{message}</MessagePart>}
            {showDetails && response && <MessagePart>{response}</MessagePart>}
            <Translate
              component={DetailsButton}
              content={detailAction}
              onClick={() => setShowDetails(!showDetails)}
            />
          </>
        )}
      </Message>
      <CloseButton onClick={clearError}>
        <FontAwesomeIcon icon={faTimes} />
      </CloseButton>
    </ErrorDiv>
  )
}

const MessagePart = styled.div`
  margin-bottom: 0.5rem;
  margin-top: 0.5rem;
`

const DetailsButton = styled.button.attrs({
  type: 'button',
})`
  background: none;
  color: inherit;
  border: none;
  font-weight: 700;
  border: 1px solid white;
  border-radius: 4px;
  padding: 0.25rem 0.75rem;
  cursor: pointer;
`

const CloseButton = styled.button.attrs({
  type: 'button',
})`
  margin-top: 0.25rem;
  margin-right: 0.25rem;
  background: none;
  border: none;
  color: inherit;
  cursor: pointer;
  height: fit-content;
  display: flex;
  padding: 0.5rem;
`

const Message = styled.div`
  margin: 1rem;
`

const ErrorDiv = styled.div.attrs({
  className: 'error',
})`
  display: flex;
  padding: 0;
  margin-bottom: 1rem;
  border-radius: 0.25em;
  ${p => p.errorColor && `background: ${p.theme.color[p.errorColor]};`}
`

export default ErrorMessage
