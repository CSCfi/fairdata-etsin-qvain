import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import PropTypes from 'prop-types'
import Translate from 'react-translate-component'

const ErrorMessage = ({ error, clear }) => {
  const [showDetails, setShowDetails] = useState(false)

  useEffect(() => {
    setShowDetails(false)
  }, [error])

  if (!error) {
    return null
  }

  const summaryTranslation = `dataset.dl.errors.${
    error.response?.status === 503 ? 'unknownError' : 'serviceUnavailable'
  }`
  const message = `${error.name}: ${error.message}`
  const response = error.request?.responseText

  const detailAction = `dataset.dl.errors.${showDetails ? 'hideDetails' : 'showDetails'}`

  return (
    <ErrorDiv>
      <Message style={{ flexGrow: 1 }}>
        <Translate component={MessagePart} content={summaryTranslation} />
        {showDetails && message && <MessagePart>{message}</MessagePart>}
        {showDetails && response && <MessagePart>{response}</MessagePart>}
        <Translate
          component={DetailsButton}
          content={detailAction}
          onClick={() => setShowDetails(!showDetails)}
        />
      </Message>
      <CloseButton>
        <FontAwesomeIcon icon={faTimes} onClick={clear} />
      </CloseButton>
    </ErrorDiv>
  )
}

ErrorMessage.propTypes = {
  error: PropTypes.object,
  clear: PropTypes.func.isRequired,
}

ErrorMessage.defaultProps = {
  error: null,
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
`

export default ErrorMessage
