import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Translate from 'react-translate-component'
import { Container } from './card'

const SubmitResponse = ({ response }) => {
  console.log(response)
  if ('identifier' in response) {
    const identifier = response.identifier
    return (
      <Container>
        <ResponseLabel success>
          <Translate content="qvain.submitStatus.success" />
        </ResponseLabel>
        <p>Identifier: {identifier}</p>
      </Container>
    )
  }
  return (
    <Container>
      <ResponseLabel>
        <Translate content="qvain.submitStatus.fail" />
      </ResponseLabel>
      <pre>{JSON.stringify(response, null, 4)}</pre>
    </Container>
  )
}

SubmitResponse.propTypes = {
  response: PropTypes.object,
}

SubmitResponse.defaultProps = {
  response: null,
}

const ResponseLabel = styled.p`
  color: ${props => (props.success ? 'green' : 'red')};
  font-size: 2em;
`

export default SubmitResponse
