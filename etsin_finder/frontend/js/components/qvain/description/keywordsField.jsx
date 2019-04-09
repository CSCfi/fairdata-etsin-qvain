import React, { Component } from 'react'
import styled from 'styled-components'

import Card from '../general/card';

class KeywordsField extends Component {
  state = {
    keywords: [],
    value: ''
  }

  handleChange = (e) => {
    this.setState({ value: e.target.value });
  }

  handleKeywordAdd = (e) => {
    if (e.keyCode === 13) {
      e.preventDefault();
      const newKeyword = this.state.value;
      this.setState(prevState => ({
        keywords: [...prevState.keywords, newKeyword]
      }))
      this.setState({ value: '' })
    }
  }

  render() {
    const keywords = this.state.keywords.map(word => (<div>{word}</div>))
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

export default KeywordsField;
