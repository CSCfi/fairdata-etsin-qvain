import React from 'react'
import PropTypes from 'prop-types'
import { inject, observer } from 'mobx-react'
import { toJS } from 'mobx'
import styled from 'styled-components'
import Translate from 'react-translate-component'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons'

import Button from '../../general/button';
import Card from '../general/card';
import Label from '../general/label';

class OtherIdentifierField extends React.Component {
  static propTypes = {
    Stores: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props)
    this.state = { identifier: '' }
  }

  handleInputChange = (event) => {
    this.setState({
      identifier: event.target.value
    })
  }

  clearInput = () => {
    this.setState({
      identifier: ''
    })
  }

  handleAdd = (event) => {
    event.preventDefault()
    this.props.Stores.Qvain.addOtherIdentifier(this.state.identifier)
    this.clearInput()
  }

  handleRemove = (identifier) => {
    this.props.Stores.Qvain.removeOtherIdentifier(identifier)
  }

  render() {
    const otherIdentifiers = toJS(this.props.Stores.Qvain.otherIdentifiers.map((identifier) => (
      <Label color="#007fad" margin="0 0.5em 0.5em 0" key={identifier}>
        <PaddedWord>{ identifier }</PaddedWord>
        <FontAwesomeIcon onClick={() => this.handleRemove(identifier)} icon={faTimes} size="xs" />
      </Label>
    )))
    return (
      <Card bottomContent>
        <Translate component="h3" content="qvain.description.otherIdentifiers.title" />
        <Translate component="p" content="qvain.description.otherIdentifiers.instructions" />
        {otherIdentifiers}
        <Input
          type="text"
          value={this.state.identifier}
          onChange={this.handleInputChange}
          placeholder="http://orcid.org/"
        />
        <ButtonContainer>
          <AddNewButton onClick={this.handleAdd}>
            <Translate content="qvain.description.otherIdentifiers.addButton" />
          </AddNewButton>
        </ButtonContainer>
      </Card>
    )
  }
}

const Input = styled.input`
  width: 100%;
  border-radius: 3px;
  border: 1px solid #cccccc;
  padding: 8px;
  color: #808080;
`
const ButtonContainer = styled.div`
  text-align: right;
`
const AddNewButton = styled(Button)`
  margin: 0;
  margin-top: 11px;
`
const PaddedWord = styled.span`
padding-right: 10px;
`

export default inject('Stores')(observer(OtherIdentifierField));
