import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Translate from 'react-translate-component'
import { inject, observer } from 'mobx-react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons'
import styled from 'styled-components'

import RightsAndLicenses from './licenses'
import Description from './description'
import Actors from './actors'
import { qvainFormSchema } from './utils/formValidation'
import Files from './files'
import {
  QvainContainer,
  SubHeader,
  StickySubHeaderWrapper,
  StickySubHeader,
  StickySubHeaderResponse,
  SubHeaderText,
  Container
} from './general/card'
import handleSubmitToBackend from './utils/handleSubmit'
import Title from './general/title'
import SubmitResponse from './general/submitResponse'
import { InvertedButton } from '../general/button';

class Qvain extends Component {
  static propTypes = {
    Stores: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props)
    this.setFocusOnSubmitOrUpdateButton = this.setFocusOnSubmitOrUpdateButton.bind(this);
    this.submitDatasetButton = React.createRef();
    this.updateDatasetButton = React.createRef();
  }

  state = {
    response: null,
    submitted: false,
  }

  componentWillUnmount() {
    this.props.Stores.Qvain.resetQvainStore()
    this.props.Stores.Qvain.original = undefined
  }

  setFocusOnSubmitOrUpdateButton(event) {
    if (this.props.Stores.Qvain.original) {
      this.updateDatasetButton.current.focus()
    } else {
      this.submitDatasetButton.current.focus()
    }
    // preventDefault, since the page wants to refresh at this point
    event.preventDefault();
  }

  handleCreate = e => {
    e.preventDefault()
    this.setState({ submitted: true })
    const obj = handleSubmitToBackend(this.props.Stores.Qvain)
    console.log(JSON.stringify(obj, null, 4))
    qvainFormSchema
      .validate(obj, { abortEarly: false })
      .then(val => {
        console.log(val)
        axios
          .post('/api/dataset', obj)
          .then(res => {
            this.setState({ response: JSON.parse(res.data) })
            if (this.state.response && 'identifier' in this.state.response) {
              this.props.Stores.Qvain.resetQvainStore()
            }
          })
          .catch(err => {
            // Refreshing error header
            this.setState({ response: null })

            // If user is not logged in, display logged in error
            if (err.response.data.PermissionError) {
              this.setState({ response: [err.response.data.PermissionError] })

            // If user is logged in...
            } else if (err.response.data) {
            // ...try to format the Metax error
            if ((err.response.data.includes(':["')) && (err.response.data.includes('"],'))) {
              this.setState({
                response:
                  [
                    err.response.data.slice(
                    err.response.data.indexOf(':["') + 3,
                    err.response.data.indexOf('"],'))
                  ]
              })

            // If the Metax error message formatting cannot be done, just display the entire error
            } else {
              this.setState({
                response: [err.response.data]
              })
            }

            // If error response is empty, just display 'Error...'
            } else {
              this.setState({
                response: ['Error...']
              })
            }
          })
      })
      .catch(err => {
        console.log(err.errors)

        // Refreshing error header
        this.setState({ response: null })
        this.setState({ response: err.errors })
      })
  }

  handleUpdate = e => {
    e.preventDefault()
    this.setState({ submitted: true })
    const obj = handleSubmitToBackend(this.props.Stores.Qvain)
    obj.original = this.props.Stores.Qvain.original
    console.log(JSON.stringify(obj, null, 4))
    qvainFormSchema
      .validate(obj, { abortEarly: false })
      .then(val => {
        console.log(val)
        axios
          .patch('/api/dataset', obj)
          .then(res => {
            this.props.Stores.Qvain.moveSelectedToExisting()
            this.props.Stores.Qvain.setChanged(false)
            this.setState({ response: JSON.parse(res.data) })
          })
          .catch(err => {
            // Refreshing error header
            this.setState({ response: null })

            // If user is not logged in, display logged in error
            if (err.response.data.PermissionError) {
              this.setState({ response: [err.response.data.PermissionError] })

            // If user is logged in...
            } else if (err.response.data) {
            // ...try to format the Metax error
            if ((err.response.data.includes(':["')) && (err.response.data.includes('"],'))) {
              this.setState({
                response:
                  [
                    err.response.data.slice(
                    err.response.data.indexOf(':["') + 3,
                    err.response.data.indexOf('"],'))
                  ]
              })

            // If the Metax error message formatting cannot be done, just display the entire error
            } else {
              this.setState({
                response: [err.response.data]
              })
            }

            // If error response is empty, just display 'Error...'
            } else {
              this.setState({
                response: ['Error...']
              })
            }
          })
      })
      .catch(err => {
        console.log(err.errors)

        // Refreshing error header
        this.setState({ response: null })
        this.setState({ response: err.errors })
      })
  }

  render() {
    return (
      <QvainContainer>
        <SubHeader>
          <SubHeaderTextContainer>
            <SubHeaderText>
              <Translate component={Title} content={this.props.Stores.Qvain.original ? 'qvain.titleEdit' : 'qvain.titleCreate'} />
            </SubHeaderText>
          </SubHeaderTextContainer>
          <LinkBackContainer>
            <LinkBack to="/qvain">
              <FontAwesomeIcon size="lg" icon={faChevronLeft} />
              <Translate component="span" display="block" content="qvain.backLink" />
            </LinkBack>
          </LinkBackContainer>
        </SubHeader>
        <StickySubHeaderWrapper>
          <StickySubHeader>
            <ButtonContainer>
              {this.props.Stores.Qvain.original
                ? (
                  <SubmitButton ref={this.updateDatasetButton} type="button" onClick={this.handleUpdate}>
                    <Translate content="qvain.edit" />
                  </SubmitButton>
                )
                : (
                  <SubmitButton ref={this.submitDatasetButton} type="button" onClick={this.handleCreate}>
                    <Translate content="qvain.submit" />
                  </SubmitButton>
                )
              }
            </ButtonContainer>
          </StickySubHeader>
          {this.state.submitted ? (
            <StickySubHeaderResponse>
              <SubmitResponse response={this.state.response} />
            </StickySubHeaderResponse>
          ) : null}
        </StickySubHeaderWrapper>
        <Form className="container">
          <Description />
          <Actors />
          <RightsAndLicenses />
          <Files />
          <SubmitContainer>
            <Translate component="p" content="qvain.consent" unsafe />
          </SubmitContainer>
          <STSD onClick={this.setFocusOnSubmitOrUpdateButton}>
            <Translate content="stsd" />
          </STSD>
        </Form>
      </QvainContainer>
    )
  }
}

const STSD = styled.button`
    background: ${p => p.theme.color.primary};
    color: #fafafa;
    max-height: 0;
    width: 100%;
    margin: 0;
    padding: 0;
    border: none;
    letter-spacing: 2px;
    transition: 0.2s ease;
    &:focus {
    text-decoration: underline;
    padding: 0.5em;
    max-height: 3em;
    }
`
const SubHeaderTextContainer = styled.div`
  white-space: nowrap;
`
const LinkBackContainer = styled.div`
  text-align: right;
  width: 100%;
  white-space: nowrap;
`
const LinkBack = styled(Link)`
  color: #fff;
  margin-right: 40px;
`
const ButtonContainer = styled.div`
  text-align: center;
  padding-top: 2px;
`
const SubmitButton = styled(InvertedButton)`
  background: #fff;
  font-size: 1.2em;
  border-radius: 25px;
  padding: 5px 30px;
  border-color: #007fad;
  border: 1px solid;
`
const Form = styled.form`
  margin-bottom: 20px;
`
const SubmitContainer = styled(Container)`
  padding-bottom: 25px;
  margin: 15px;
`

export default inject('Stores')(observer(Qvain))
