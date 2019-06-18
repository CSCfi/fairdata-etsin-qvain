import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Translate from 'react-translate-component'
import { inject, observer } from 'mobx-react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons'
import styled from 'styled-components';

import RightsAndLicenses from './licenses'
import Description from './description'
import Participants from './participants'
import { qvainFormSchema } from './utils/formValidation'
import Files from './files'
import { QvainContainer, SubHeader, SubHeaderText, Container } from './general/card'
import handleSubmitToBackend from './utils/handleSubmit'
import Title from './general/title'

class Qvain extends Component {
  static propTypes = {
    Stores: PropTypes.object.isRequired,
  }

  state = {
    response: null,
  }

  handleSubmit = e => {
    e.preventDefault()
    const obj = handleSubmitToBackend(this.props.Stores.Qvain)
    console.log(JSON.stringify(obj, null, 4))
    qvainFormSchema
      .validate(obj, { abortEarly: false })
      .then(val => {
        console.log(val)
        axios
          .post('/api/dataset', obj)
          .then(res => this.setState({ response: res.data }))
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
        <form onSubmit={this.handleSubmit} className="container">
          <LinkBack to="/qvain"><FontAwesomeIcon size="lg" icon={faChevronLeft} /><Translate component="span" content="qvain.backLink" /></LinkBack>
          <Description />
          <Participants />
          <RightsAndLicenses />
          <Files />
          <button type="submit">submit</button>
          {this.state.response ? (
            <Container>
              <pre>{JSON.stringify(this.state.response, null, 4)}</pre>
            </Container>
          ) : null}
        </form>
      </QvainContainer>
    )
  }
}

const LinkBack = styled(Link)`
  display: inline-block;
  margin: 10px 15px 0;
`

export default inject('Stores')(observer(Qvain))
