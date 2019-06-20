import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Translate from 'react-translate-component'
import { Container, SlidingContent } from './card'
import Loader from '../../general/loader'
import { InvertedButton } from '../../general/button'

class SubmitResponse extends Component {
  state = {
    openResponse: false,
  }

  render() {
    const { response } = this.props
    const { openResponse } = this.state
    if (response && 'identifier' in response) {
      const identifier = response.identifier
      return (
        <ResponseContainer>
          <ResponseLabel success>
            <Translate content="qvain.submitStatus.success" />
          </ResponseLabel>
          <p>Identifier: {identifier}</p>
        </ResponseContainer>
      )
    }
    if (response) {
      return (
        <ResponseContainer>
          <ResponseLabel>
            <Translate content="qvain.submitStatus.fail" />
          </ResponseLabel>
          <InvertedButton
            color="red"
            onClick={() => this.setState(prevState => ({ openResponse: !prevState.openResponse }))}
            type="button"
          >
            {openResponse ? (
              <Translate content="qvain.closeErrorMessages" />
            ) : (
              <Translate content="qvain.openErrorMessages" />
            )}
          </InvertedButton>
          <SlidingContent open={openResponse}>
            <Pre>{JSON.stringify(response, null, 4)}</Pre>
          </SlidingContent>
        </ResponseContainer>
      )
    }
    return (
      <ResponseContainer>
        <Loader active />
      </ResponseContainer>
    )
  }
}

SubmitResponse.propTypes = {
  response: PropTypes.oneOfType([PropTypes.string, PropTypes.object, PropTypes.array]),
}

SubmitResponse.defaultProps = {
  response: null,
}

const ResponseLabel = styled.p`
  color: ${props => (props.success ? 'green' : 'red')};
  font-size: 2em;
`
const ResponseContainer = styled(Container)`
  padding: 25px 45px 45px 45px;
  margin: 15px;
`
const Pre = styled.pre`
  color: white;
  margin-top: inherit;
  padding: 15px;
  background-color: black;
  white-space: pre-wrap; /* Since CSS 2.1 */
  white-space: -moz-pre-wrap; /* Mozilla, since 1999 */
  white-space: -pre-wrap; /* Opera 4-6 */
  white-space: -o-pre-wrap; /* Opera 7 */
  word-wrap: break-word;
`
export default SubmitResponse
