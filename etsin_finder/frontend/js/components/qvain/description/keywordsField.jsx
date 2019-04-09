import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react'
import { toJS } from 'mobx'
import styled from 'styled-components'

import Card from '../general/card';

class KeywordsField extends Component {
  static propTypes = {
    Stores: PropTypes.object.isRequired
  }

  state = {
    value: ''
  }

  handleChange = (e) => {
    this.setState({ value: e.target.value });
  }

  handleKeywordAdd = (e) => {
    if (e.keyCode === 13) {
      e.preventDefault();
      const newKeyword = this.state.value;
      this.props.Stores.Qvain.setKeywords([
        ...toJS(this.props.Stores.Qvain.keywords),
        newKeyword
      ])
      this.setState({ value: '' })
    }
  }

  render() {
    const keywords = toJS(this.props.Stores.Qvain.keywords).map(word => (
      <div key={word}>{ word }</div>)
    )
    return (
      <Card>
        <h3>Keywords</h3>
        {keywords}
        <Input
          value={this.state.value}
          onChange={this.handleChange}
          onKeyDown={this.handleKeywordAdd}
          type="text"
          placeholder="Title (English)"
        />
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

export default inject('Stores')(observer(KeywordsField));
