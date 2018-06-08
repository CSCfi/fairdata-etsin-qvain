import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Translate from 'react-translate-component'
import styled from 'styled-components'

import Person from './person'
import checkDataLang from '../../../utils/checkDataLang'
import { LinkButton } from '../../general/button'

export default class People extends Component {
  constructor(props) {
    super(props)
    const mode = typeof props.creator === 'object' ? 'creator' : 'contributor'
    // if (this.props[mode].length > 3) {

    // }
    this.state = {
      mode,
      firstThree: this.props[mode].slice(0, 3),
      rest: this.props[mode].slice(3),
      open: false,
    }

    this.toggleOpen = this.toggleOpen.bind(this)
  }

  toggleOpen() {
    this.setState({
      open: !this.state.open,
    })
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
          {/* Show first three */}
          {this.state.firstThree.map((person, i) => (
            <Person key={checkDataLang(person.name)} first={i === 0} person={person} />
          ))}
          {/* Show the rest */}
          {this.props[this.state.mode].length > 3 &&
            this.state.open &&
            this.state.rest.map(person => (
              <Person key={checkDataLang(person.name)} person={person} />
            ))}
          {/* Show Button to open rest */}{' '}
          {this.props[this.state.mode].length > 3 && (
            <LinkButton onClick={this.toggleOpen}>
              [ {this.state.open ? 'show less' : 'show more'} ]
            </LinkButton>
          )}
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
