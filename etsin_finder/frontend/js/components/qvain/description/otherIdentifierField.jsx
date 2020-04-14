import React from 'react'
import PropTypes from 'prop-types'
import { inject, observer } from 'mobx-react'
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
      validationError: null,
    }
  }

  handleInputChange = event => {
    const { value } = event.target
    const { setOtherIdentifier } = this.props.Stores.Qvain
    setOtherIdentifier(value)
  }

  clearInput = () => {
    const { setOtherIdentifier } = this.props.Stores.Qvain
    setOtherIdentifier('')
  }

  handleAddClick = event => {
    event.preventDefault()
    const { otherIdentifier, otherIdentifiers, addOtherIdentifier } = this.props.Stores.Qvain
    otherIdentifierSchema
      .validate(otherIdentifier)
      .then(() => {
        if (!otherIdentifiers.includes(otherIdentifier)) {
          addOtherIdentifier(otherIdentifier)
          this.clearInput()
        } else {
          this.setState({
            validationError: translate('qvain.description.otherIdentifiers.alreadyAdded'),
          })
        }
      })
      .catch(err => {
        this.setState({ validationError: err.errors })
      })
  }

  handleRemove = identifier => {
    const { removeOtherIdentifier } = this.props.Stores.Qvain
    removeOtherIdentifier(identifier)
  }

  handleBlur = () => {
    this.setState({ validationError: null })
    this.validateOtherIdentifiers()
  }

  validateOtherIdentifiers = () => {
    const { otherIdentifiers } = this.props.Stores.Qvain
    otherIdentifiersSchema
      .validate(otherIdentifiers)
      .then(() => {
        this.setState({ validationError: null })
      })
      .catch(err => {
        this.setState({ validationError: err.errors })
      })
  }

  render() {
    const { readonly, otherIdentifier, otherIdentifiers } = this.props.Stores.Qvain
    const otherIdentifiersLabels = otherIdentifiers.map(identifier => (
      <Label color="primary" margin="0 0.5em 0.5em 0" key={identifier}>
        <PaddedWord>{identifier}</PaddedWord>
        <FontAwesomeIcon onClick={() => this.handleRemove(identifier)} icon={faTimes} size="xs" />
      </Label>
    ))
    return (
      <Card bottomContent>
        <LabelLarge htmlFor="otherIdentifiersInput">
          <Translate content="qvain.description.otherIdentifiers.title" />
        </LabelLarge>
        <Translate component="p" content="qvain.description.otherIdentifiers.instructions" />
        {otherIdentifiersLabels}
        <Input
          type="text"
          id="otherIdentifiersInput"
          disabled={readonly}
          value={otherIdentifier}
          onChange={this.handleInputChange}
          placeholder="http://doi.org/"
          onBlur={this.handleBlur}
        />
        {this.state.validationError && <ValidationError>{this.state.validationError}</ValidationError>}
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
