import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Translate from 'react-translate-component';
import { inject, observer } from 'mobx-react';
import { toJS } from 'mobx';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons'

import Card from '../general/card';
import Label from '../general/label';
import { keywordsSchema } from '../utils/formValidation';
import ValidationError from '../general/validationError';

class KeywordsField extends Component {
  static propTypes = {
    Stores: PropTypes.object.isRequired
  }

  state = {
    value: '',
    keywordsValidationError: null
  }

  handleChange = (e) => {
    this.setState({ value: e.target.value });
    this.setState({ keywordsValidationError: null })
  }

  handleBlur = () => {
    keywordsSchema.validate(this.props.Stores.Qvain.keywords)
      .then(() => {
        this.setState({ keywordsValidationError: null })
      })
      .catch((err) => {
        this.setState({ keywordsValidationError: err.errors })
      })
  }

  handleKeywordAdd = (e) => {
    if (e.keyCode === 13 && this.state.value.length > 0) {
      e.preventDefault();
      const newKeyword = this.state.value;
      this.props.Stores.Qvain.setKeywords([
        ...toJS(this.props.Stores.Qvain.keywords),
        newKeyword
      ])
      this.setState({ value: '' })
    }
  }

  handleKeywordRemove = (word) => {
    this.props.Stores.Qvain.removeKeyword(word)
  }

  render() {
    const keywords = toJS(this.props.Stores.Qvain.keywords).map(word => (
      <Label color="#007fad" margin="0 0.5em 0.5em 0" key={word}>
        <PaddedWord>{ word }</PaddedWord>
        <FontAwesomeIcon onClick={() => this.handleKeywordRemove(word)} icon={faTimes} size="xs" />
      </Label>
    ))
    return (
      <Card>
        <Translate component="h3" content="qvain.description.keywords.title" />
        {keywords}
        <Translate
          component={Input}
          value={this.state.value}
          onChange={this.handleChange}
          onBlur={this.handleBlur}
          onKeyDown={this.handleKeywordAdd}
          type="text"
          attributes={{ placeholder: 'qvain.description.keywords.placeholder' }}
        />
        <ValidationError>{this.state.keywordsValidationError}</ValidationError>
      </Card>
    )
  }
}

const Input = styled.input`
  width: 100%;
  border-radius: 3px;
  border: 1px solid #eceeef;
  padding: 8px;
  color: #808080;
  margin-bottom: 20px;
`
const PaddedWord = styled.span`
padding-right: 10px;
`

export default inject('Stores')(observer(KeywordsField));
