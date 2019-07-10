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
import { QvainContainer, SubHeader, SubHeaderText, Container } from './general/card'
import handleSubmitToBackend from './utils/handleSubmit'
import Title from './general/title'
import SubmitResponse from './general/submitResponse'
import { InvertedButton } from '../general/button'

class Qvain extends Component {
  static propTypes = {
    Stores: PropTypes.object.isRequired,
  }

  state = {
    response: null,
    submitted: false,
  }

  componentWillUnmount() {
    this.props.Stores.Qvain.resetQvainStore()
    this.props.Stores.Qvain.original = undefined
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
            this.setState({ response: res.data })
            if (this.state.response && 'identifier' in this.state.response) {
              this.props.Stores.Qvain.resetQvainStore()
            }
          })
          .catch(err => this.setState({ response: err }))
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
            this.setState({ response: res.data })
          })
          .catch(err => this.setState({ response: err }))
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
          <SubHeaderText>
            <Translate component={Title} content="qvain.title" />
          </SubHeaderText>
        </SubHeader>
        <Form className="container">
          <LinkBack to="/qvain">
            <FontAwesomeIcon size="lg" icon={faChevronLeft} />
            <Translate component="span" content="qvain.backLink" />
          </LinkBack>
          <Description />
          <Participants />
          <RightsAndLicenses />
          <Files />
          <SubmitContainer>
            <Translate component="p" content="qvain.consent" unsafe />
            <ButtonContainer>
              {this.props.Stores.Qvain.original
                ? (
                  <SubmitButton type="button" onClick={this.handleUpdate}>
                    <Translate content="qvain.edit" />
                  </SubmitButton>
                )
                : (
                  <SubmitButton type="button" onClick={this.handleCreate}>
                    <Translate content="qvain.submit" />
                  </SubmitButton>
                )
              }
            </ButtonContainer>
          </SubmitContainer>
          {this.state.submitted ? <SubmitResponse response={this.state.response} /> : null}
        </Form>
      </QvainContainer>
    )
  }
}

const LinkBack = styled(Link)`
  display: inline-block;
  margin: 10px 15px 0;
`
const ButtonContainer = styled.div`
  text-align: center;
`
const SubmitButton = styled(InvertedButton)`
  font-size: 1.2em;
  border-radius: 25px;
  padding: 5px 30px;
`
const Form = styled.form`
  margin-bottom: 20px;
`
const SubmitContainer = styled(Container)`
  padding-bottom: 25px;
  margin: 15px;
`

export default inject('Stores')(observer(Qvain))
