import React, { Component } from 'react'
import styled from 'styled-components'

const Container = styled.div`
  padding: 0.5em 1.2em;
  border-top: 0px;
  border-bottom: 0px;
`

const Path = styled.button`
  background: transparent;
  color: black;
  border: none;
  cursor: pointer;
  &:hover {
    color: $color-primary;
  }
`

export default class Breadcrumbs extends Component {
  pathItems(path, i) {
    if (!path) {
      return (
        <Path key={`${path}-${i}`} onClick={() => this.props.callback()}>
          Home
        </Path>
      )
    }
    if (this.props.path.length - 1 === i) {
      return <Path key={`${path}-${i}`}>{`> ${path}`}</Path>
    }
    return (
      <Path key={`${path}-${i}`} onClick={() => this.props.callback(path)}>
        {`> ${path}`}
      </Path>
    )
  }

  render() {
    return (
      <Container className="light-border">
        {this.pathItems()}
        {this.props.path.map((single, index) => this.pathItems(single, index))}
      </Container>
    )
  }
}
