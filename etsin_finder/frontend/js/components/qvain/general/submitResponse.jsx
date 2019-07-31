import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { inject, observer } from 'mobx-react'
import Translate from 'react-translate-component'
import Loader from '../../general/loader'
import { LinkButtonDarkGray } from '../../general/button';

class SubmitResponse extends Component {
  static propTypes = {
    Stores: PropTypes.object.isRequired,
    response: PropTypes.oneOfType([PropTypes.string, PropTypes.object, PropTypes.array]),
  }

  constructor() {
    super()
    this.state = {
      clearSubmitResponse: false,
    }

    this.closeSubmitResponse = this.closeSubmitResponse.bind(this)
  }

  closeSubmitResponse() {
    this.setState({
      clearSubmitResponse: true,
    })
  }

  render() {
    const { response } = this.props
    const { original } = this.props.Stores.Qvain

    // If the user wants to clear the submitResponse
    if (this.state.clearSubmitResponse) {
      this.state.clearSubmitResponse = false;
      return null;
    }

    // If a new dataset has been created successfully.
    if (response &&
        'identifier' in response &&
        !('new_version_created' in response) &&
        original === undefined
    ) {
      const identifier = response.identifier
      return (
        <ResponseContainer>
          <ResponseContainerLeftColumn>
            <ResponseLabel success>
              <Translate content="qvain.submitStatus.success" />
            </ResponseLabel>
            <p>Identifier: {identifier}</p>
          </ResponseContainerLeftColumn>
          <ResponseContainerRightColumn>
            <LinkButtonDarkGray type="button" onClick={this.closeSubmitResponse}>
              x
            </LinkButtonDarkGray>
          </ResponseContainerRightColumn>
        </ResponseContainer>
      )
    }
    // If an existing datasets metadata has successfully been updated.
    if (
      response &&
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
        <ResponseContainer>
          <ResponseContainerLeftColumn>
            <ResponseLabel success>
              <Translate content="qvain.submitStatus.editMetadataSuccess" />
            </ResponseLabel>
            <p>Identifier: {identifier}</p>
          </ResponseContainerLeftColumn>
          <ResponseContainerRightColumn>
            <LinkButtonDarkGray type="button" onClick={this.closeSubmitResponse}>
              x
            </LinkButtonDarkGray>
          </ResponseContainerRightColumn>
        </ResponseContainer>
      )
    }
    // If an existing datasets files or directorys have changed and the update
    // creates a new Version of the dataset with its own identifiers.
    if (response && 'new_version_created' in response) {
      const identifier = response.dataset_version_set
        ? response.dataset_version_set[0].identifier
        : response.identifier
      return (
        <ResponseContainer>
          <ResponseContainerLeftColumn>
            <ResponseLabel success>
              <Translate content="qvain.submitStatus.editFilesSuccess" />
            </ResponseLabel>
            <p>Identifier: {identifier}</p>
          </ResponseContainerLeftColumn>
          <ResponseContainerRightColumn>
            <LinkButtonDarkGray type="button" onClick={this.closeSubmitResponse}>
              x
            </LinkButtonDarkGray>
          </ResponseContainerRightColumn>
        </ResponseContainer>
      )
    }
    // If something went wrong.
    if (response) {
      return (
        <ResponseContainerError>
          <ResponseContainerLeftColumn>
            <ResponseLabel>
              <Translate content="qvain.submitStatus.fail" />
            </ResponseLabel>
            <p>{(response.toString().replace(/,/g, '\n'))}</p>
          </ResponseContainerLeftColumn>
          <ResponseContainerRightColumn>
            <LinkButtonDarkGray type="button" onClick={this.closeSubmitResponse}>
              x
            </LinkButtonDarkGray>
          </ResponseContainerRightColumn>
        </ResponseContainerError>
      )
    }

    return (
      <ResponseContainerLoading>
        <Loader active />
      </ResponseContainerLoading>
    )
  }
}

SubmitResponse.defaultProps = {
  response: null,
}

const ResponseLabel = styled.p`
  font-weight: bold;
  color: ${props => (props.success ? 'green' : 'red')};
`
const ResponseContainer = styled.div`
  background-color: #E8FFEB;
  color: green;
  z-index: 2;
  scroll-margin-top: 100px;
  width: 100%;
  border-bottom: 1px solid rgba(0,0,0,0.3);
`

const ResponseContainerLoading = styled.div`
  background-color: #fff;
  z-index: 2;
  scroll-margin-top: 100px;
  width: 100%;
  height: 105px;
  padding-top: 30px;
  border-bottom: 1px solid rgba(0,0,0,0.3);
`

const ResponseContainerError = styled.div`
  background-color: #FFEBE8;
  color: red;
  z-index: 2;
  scroll-margin-top: 100px;
  width: 100%;
  border-bottom: 1px solid rgba(0,0,0,0.3);
`
const ResponseContainerLeftColumn = styled.div`
  padding-left: 20px;
  padding-top: 20px;
  display:inline-block;
  width: 90%;
  white-space: pre-line;
`
const ResponseContainerRightColumn = styled.div`
  display:inline-block;
  width: 10%;
  text-align: right;
  padding-top: 10px;
  padding-right: 10px;
  vertical-align: top;
`
export default inject('Stores')(observer(SubmitResponse))
