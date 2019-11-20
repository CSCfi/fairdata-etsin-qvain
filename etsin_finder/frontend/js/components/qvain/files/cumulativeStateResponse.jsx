import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Translate from 'react-translate-component'
import Loader from '../../general/loader'
import { LinkButtonDarkGray } from '../../general/button';

class CumulativeStateResponse extends Component {
  static propTypes = {
    response: PropTypes.object,
    onClearResponse: PropTypes.func.isRequired,
  }

  constructor() {
    super()
    this.closeResponse = this.closeResponse.bind(this)
  }

  closeResponse() {
    this.props.onClearResponse()
  }

  render() {
    const { response } = this.props

    // If something went wrong.
    if (response && response.error) {
      return (
        <ResponseContainerError>
          <ResponseContainerContent>
            <ResponseLabel>
              <Translate content="qvain.submitStatus.fail" />
            </ResponseLabel>
            <p>{(response.error.toString().replace(/,/g, '\n'))}</p>
          </ResponseContainerContent>
          <ResponseContainerCloseButtonContainer>
            <LinkButtonDarkGray type="button" onClick={this.closeResponse}>
              x
            </LinkButtonDarkGray>
          </ResponseContainerCloseButtonContainer>
        </ResponseContainerError>
      )
    }

    // If response was ok.
    if (response) {
      // Get new identifier if new version was created.
      const newIdentifier = response.new_version_created && response.new_version_created.identifier
      return (
        <ResponseContainerSuccess>
          <ResponseContainerContent>
            <ResponseLabel success>
              <Translate content="qvain.files.cumulativeState.changeComplete" />
            </ResponseLabel>
            { newIdentifier ?
              <Translate component="p" content="qvain.files.cumulativeState.versionCreated" with={{identifier: newIdentifier}} />
              : null
            }
          </ResponseContainerContent>
          <ResponseContainerCloseButtonContainer>
            <LinkButtonDarkGray type="button" onClick={this.closeResponse}>
              x
            </LinkButtonDarkGray>
          </ResponseContainerCloseButtonContainer>
        </ResponseContainerSuccess>
      )
    }

    // No response loaded yet, show loader.
    return (
      <ResponseContainerLoading>
        <Loader active />
      </ResponseContainerLoading>
    )
  }
}

CumulativeStateResponse.defaultProps = {
  response: null,
}

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
  border-bottom: 1px solid rgba(0,0,0,0.3);
  position: relative;
`
const ResponseContainerError = styled.div`
  background-color: #FFEBE8;
  text-align: center;
  width: 100%;
  color: red;
  z-index: 2;
  border-bottom: 1px solid rgba(0,0,0,0.3);
  position: relative;
`

const ResponseContainerLoading = styled.div`
  background-color: #fff;
  text-align: center;
  width: 100%;
  z-index: 2;
  height: 105px;
  padding-top: 30px;
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
  display:inline-block;
  text-align: right;
  padding-top: 10px;
  padding-right: 20px;
  position: absolute;
`
export default CumulativeStateResponse
