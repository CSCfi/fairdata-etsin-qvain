import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Translate from 'react-translate-component'
import styled from 'styled-components'

import checkDataLang from '../../utils/checkDataLang'

export default class Person extends Component {
  constructor(props) {
    super(props)
    const mode = typeof props.creator === 'object' ? 'creator' : 'contributor'
    this.state = { mode }
  }

  renderPerson(people, i, arr) {
    return typeof people.name === 'object' ? (
      <span key={checkDataLang(people.name)}>
        {checkDataLang(people.name)}
        {i + 1 !== arr.length ? ', ' : ''}
      </span>
    ) : (
      <span key={people.name}>
        {people.name}
        {i + 1 !== arr.length ? ', ' : ''}
      </span>
    )
  }

  render() {
    return this.props[this.state.mode] ? (
      <PersonCont>
        {this.props[this.state.mode].length > 1 ? (
          <Translate content={`dataset.${this.state.mode}.plrl`} />
        ) : (
          <Translate content={`dataset.${this.state.mode}.snglr`} />
        )}
        {': '}
        {this.props[this.state.mode].map((people, i, arr) => this.renderPerson(people, i, arr))}
      </PersonCont>
    ) : null
  }
}

Person.defaultProps = {
  creator: undefined,
}

Person.propTypes = {
  creator: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
}

const PersonCont = styled.p`
  margin-bottom: 0;
`
