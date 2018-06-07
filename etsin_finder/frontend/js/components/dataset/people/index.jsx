import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Translate from 'react-translate-component'
import styled from 'styled-components'

import Person from './person'
import checkDataLang from '../../../utils/checkDataLang'

export default class People extends Component {
  constructor(props) {
    super(props)
    const mode = typeof props.creator === 'object' ? 'creator' : 'contributor'
    this.state = { mode }
  }

  render() {
    return this.props[this.state.mode] ? (
      <PeopleCont>
        {this.props[this.state.mode].length > 1 ? (
          <Translate content={`dataset.${this.state.mode}.plrl`} />
        ) : (
          <Translate content={`dataset.${this.state.mode}.snglr`} />
        )}
        {': '}
        <InlineUl>
          {console.log(this.props[this.state.mode])}
          {this.props[this.state.mode].map((person, i) => (
            <Person key={checkDataLang(person.name)} first={i === 0} person={person} />
          ))}
        </InlineUl>
      </PeopleCont>
    ) : null
  }
}

People.defaultProps = {
  creator: undefined,
}

People.propTypes = {
  creator: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
}

const PeopleCont = styled.div`
  margin-bottom: 0;
`

const InlineUl = styled.ul`
  display: inline;
  margin: 0;
  padding: 0;
`
