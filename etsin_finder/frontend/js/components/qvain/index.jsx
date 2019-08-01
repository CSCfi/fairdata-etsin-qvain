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
import Participants from './participants'
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
import isJsonString from './utils/isJsonSring'
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
            console.log(err.response)
            const res = {
              Error: isJsonString(err.response.data)
                ? JSON.parse(err.response.data)
                : err.response.data,
              Status: err.response.status,
              Data: isJsonString(err.response.config.data)
                ? JSON.parse(err.response.config.data)
                : err.response.config.data,
            }
            this.setState(err ? { response: res } : { response: 'Error...' })
          })
      })
      .catch(err => {
        console.log(err.errors)
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
            this.props.Stores.Qvain.resetQvainStore()
            this.props.Stores.Qvain.original = undefined
            this.setState({ response: JSON.parse(res.data) })
          })
          .catch(err => {
            console.log(err.response)
            const res = {
              Error: isJsonString(err.response.data)
                ? JSON.parse(err.response.data)
                : err.response.data,
              Status: err.response.status,
              Data: isJsonString(err.response.config.data)
                ? JSON.parse(err.response.config.data)
                : err.response.config.data,
            }
            this.setState(err ? { response: res } : { response: 'Error...' })
          })
      })
      .catch(err => {
        console.log(err.errors)
        this.setState({ response: err.errors })
      })
  }

  render() {
    return (
      <QvainContainer>
        <SubHeader>
          <SubHeaderTextContainer>
            <SubHeaderText>
              <Translate component={Title} content="qvain.title" />
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
          <Participants />
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
