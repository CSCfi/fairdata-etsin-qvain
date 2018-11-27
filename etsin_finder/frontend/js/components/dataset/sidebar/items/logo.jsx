import React, { Component } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import Image from '../../../general/image'

function importAll(r) {
  const images = {}
  r.keys().map(item => {
    images[item.replace('./', '')] = r(item)
    return true
  })
  return images
}

export default class Logo extends Component {
  static propTypes = {
    alt: PropTypes.string.isRequired,
    file: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
  }
  constructor(props) {
    super(props)

    this.state = {
      images: importAll(
        require.context('../../../../../static/images/catalog_logos', false, /\.(png|jpe?g|svg)$/)
      ),
    }
  }

  render() {
    return (
      <Cont>
        {this.props.url ? (
          <a href={this.props.url} target="_blank" rel="noopener noreferrer">
            <Image alt={this.props.alt} file={this.state.images[this.props.file]} />
          </a>
        ) : (
          <Image alt={this.props.alt} file={this.state.images[this.props.file]} />
        )}
      </Cont>
    )
  }
}

const Cont = styled.div`
  text-align: center;
  margin-bottom: 1em;
`
