import React from 'react'
import PropTypes from 'prop-types'
import { inject, observer } from 'mobx-react'
import { toJS } from 'mobx'
import styled from 'styled-components'
import Translate from 'react-translate-component'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import translate from 'counterpart'
import Button from '../../general/button'
import Card from '../general/card'
import Label from '../general/label'
import { otherIdentifiersSchema, otherIdentifierSchema } from '../utils/formValidation'
import ValidationError from '../general/validationError'
import { Input, LabelLarge } from '../general/form'

class OtherIdentifierField extends React.Component {
  static propTypes = {
    Stores: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props)
    this.state = {
      identifier: '',
      validationError: null,
    }
  }

  handleInputChange = event => {
    const { value } = event.target
    otherIdentifierSchema.validate(value).catch(err => {
      this.setState({ validationError: err.errors })
    })
    this.setState({
      identifier: value,
    })
  }

  clearInput = () => {
    this.setState({
      identifier: '',
    })
  }

  handleAddClick = event => {
    event.preventDefault()
    otherIdentifierSchema
      .validate(this.state.identifier)
      .then(() => {
        if (!this.props.Stores.Qvain.otherIdentifiers.includes(this.state.identifier)) {
          this.props.Stores.Qvain.addOtherIdentifier(this.state.identifier)
        } else {
          this.setState({
            validationError: translate('qvain.description.otherIdentifiers.alreadyAdded'),
          })
        }
        this.clearInput()
      })
      .catch(err => {
        this.setState({ validationError: err.errors })
      })
  }

  handleRemove = identifier => {
    this.props.Stores.Qvain.removeOtherIdentifier(identifier)
    this.validateIdentifiers()
  }

  handleBlur = () => {
    this.setState({ validationError: undefined })
    this.validateIdentifiers()
  }

  handleBlur = () => {
    this.setState({ validationError: undefined })
    this.validateIdentifiers()
  }

  validateIdentifiers = () => {
    otherIdentifiersSchema
      .validate(this.props.Stores.Qvain.otherIdentifiers)
      .then(() => {
        this.setState({ validationError: null })
      })
      .catch(err => {
        this.setState({ validationError: err.errors })
      })
  }

  render() {
    const { readonly } = this.props.Stores.Qvain
    const otherIdentifiers = toJS(
      this.props.Stores.Qvain.otherIdentifiers.map(identifier => (
        <Label color="#007fad" margin="0 0.5em 0.5em 0" key={identifier}>
          <PaddedWord>{identifier}</PaddedWord>
          <FontAwesomeIcon onClick={() => this.handleRemove(identifier)} icon={faTimes} size="xs" />
        </Label>
      ))
    )
    return (
      <Card bottomContent>
        <LabelLarge htmlFor="otherIdentifiersInput">
          <Translate content="qvain.description.otherIdentifiers.title" />
        </LabelLarge>
        <Translate component="p" content="qvain.description.otherIdentifiers.instructions" />
        {otherIdentifiers}
        <Input
          type="text"
          id="otherIdentifiersInput"
          disabled={readonly}
          value={this.state.identifier}
          onChange={this.handleInputChange}
          placeholder="http://doi.org/"
          onBlur={this.handleBlur}
        />
        <ValidationError>{this.state.validationError}</ValidationError>
        <ButtonContainer>
          <AddNewButton type="button" onClick={this.handleAddClick} disabled={readonly}>
            <Translate content="qvain.description.otherIdentifiers.addButton" />
          </AddNewButton>
        </ButtonContainer>
      </Card>
    )
  }
}

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

export default inject('Stores')(observer(OtherIdentifierField))
