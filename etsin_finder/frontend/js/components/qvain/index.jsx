import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Translate from 'react-translate-component'
import { inject, observer } from 'mobx-react'
import axios from 'axios'

import RightsAndLicenses from './licenses'
import Description from './description'
import Participants from './participants'
import { qvainFormSchema } from './utils/formValidation'
import Files from './files'
import { QvainContainer, SubHeader, SubHeaderText, Container } from './general/card'
import handleSubmitToBackend from './utils/handleSubmit'

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
            <Translate content="qvain.title" />
          </SubHeaderText>
        </SubHeader>
        <form onSubmit={this.handleSubmit} className="container">
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

export default inject('Stores')(observer(Qvain))
