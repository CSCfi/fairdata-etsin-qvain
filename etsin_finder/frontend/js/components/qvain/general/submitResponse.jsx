import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled, { keyframes } from 'styled-components'
import { inject, observer } from 'mobx-react'
import Translate from 'react-translate-component'
import { Link } from 'react-router-dom'
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
        <ResponseContainerSuccess>
          <ResponseContainerContent>
            <ResponseLabel success>
              <Translate content="qvain.submitStatus.success" />
            </ResponseLabel>
            <LinkToEtsin to={`/dataset/${identifier}`}>
              <Translate content="qvain.datasets.goToEtsin" />
            </LinkToEtsin>
            <p>Identifier: {identifier}</p>
          </ResponseContainerContent>
          <ResponseContainerCloseButtonContainer>
            <LinkButtonDarkGray type="button" onClick={this.closeSubmitResponse}>
              x
            </LinkButtonDarkGray>
          </ResponseContainerCloseButtonContainer>
        </ResponseContainerSuccess>
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
        <ResponseContainerSuccess>
          <ResponseContainerContent>
            <ResponseLabel success>
              <Translate content="qvain.submitStatus.editMetadataSuccess" />
            </ResponseLabel>
            <LinkToEtsin to={`/dataset/${identifier}`}>
              <Translate content="qvain.datasets.goToEtsin" />
            </LinkToEtsin>
            <p>Identifier: {identifier}</p>
          </ResponseContainerContent>
          <ResponseContainerCloseButtonContainer>
            <LinkButtonDarkGray type="button" onClick={this.closeSubmitResponse}>
              x
            </LinkButtonDarkGray>
          </ResponseContainerCloseButtonContainer>
        </ResponseContainerSuccess>
      )
    }
    // If an existing datasets files or directorys have changed and the update
    // creates a new version of the dataset with its own identifiers.
    if (response && 'new_version_created' in response) {
      const identifier = response.dataset_version_set
        ? response.dataset_version_set[0].identifier
        : response.identifier
      return (
        <ResponseContainerSuccess>
          <ResponseContainerContent>
            <ResponseLabel success>
              <Translate content="qvain.submitStatus.editFilesSuccess" />
            </ResponseLabel>
            <LinkToEtsin to={`/dataset/${identifier}`}>
              <Translate content="qvain.datasets.goToEtsin" />
            </LinkToEtsin>
            <p>Identifier: {identifier}</p>
          </ResponseContainerContent>
          <ResponseContainerCloseButtonContainer>
            <LinkButtonDarkGray type="button" onClick={this.closeSubmitResponse}>
              x
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
            <p>{(response.toString().replace(/,/g, '\n'))}</p>
          </ResponseContainerContent>
          <ResponseContainerCloseButtonContainer>
            <LinkButtonDarkGray type="button" onClick={this.closeSubmitResponse}>
              x
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
}

SubmitResponse.defaultProps = {
  response: null,
}

const LinkToEtsin = styled(Link)`
  color: green;
  display: inline-block;
  vertical-align: top;
  text-decoration: underline;
  margin-left: 10px;
  margin-bottom: 0px;
  cursor: pointer;
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
  border-bottom: 1px solid rgba(0,0,0,0.3);
`
const ResponseContainerLoading = styled.div`
  background-color: #fff;
  text-align: center;
  width: 100%;
  z-index: 2;
  height: 105px;
  padding-top: 30px;
  border-bottom: 1px solid rgba(0,0,0,0.3);
`
const FadeInAnimation = keyframes`
  from {
    color: #FFEBE8;
  }
  to {
    color: red;
  }
`
const ResponseContainerError = styled.div`
  background-color: #FFEBE8;
  text-align: center;
  width: 100%;
  color: red;
  z-index: 2;
  border-bottom: 1px solid rgba(0,0,0,0.3);
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
  display:inline-block;
  text-align: right;
  padding-top: 10px;
  padding-right: 20px;
  position: absolute;
`
export default inject('Stores')(observer(SubmitResponse))
