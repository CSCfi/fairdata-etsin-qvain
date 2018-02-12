import React, { Component } from 'react'
import styled from 'styled-components'
import { TransparentButton } from '../../general/button'

const Container = styled.nav`
  padding: 0.5em 0.5em;
  width: 100%;
  border-top: 0px;
  border-bottom: 0px;
  display: inline-flex;
`
const Path = styled.div`
  display: flex;
  align-items: center;
`

export default class Breadcrumbs extends Component {
  pathItems(path, i, id) {
    if (!path) {
      return (
        <Path key={`path-home-${i}`}>
          <TransparentButton onClick={() => this.props.callback()}>Home</TransparentButton>
        </Path>
      )
    }
    if (this.props.path.length - 1 === i) {
      return (
        <Path key={`${path}-${i}`}>
          <span>{'>'}</span>
          <TransparentButton aria-current="true">{path}</TransparentButton>
        </Path>
      )
    }
    return (
      <Path key={`${path}-${i}`}>
        <span>{'>'}</span>
        <TransparentButton onClick={() => this.props.callback(path, id)}>{path}</TransparentButton>
      </Path>
    )
  }

  render() {
    return (
      <Container aria-label="Breadcrumb" className="light-border">
        {this.pathItems()}
        {this.props.path.map((single, index) =>
          this.pathItems(single, index, this.props.ids[index])
        )}
      </Container>
    )
  }
}
