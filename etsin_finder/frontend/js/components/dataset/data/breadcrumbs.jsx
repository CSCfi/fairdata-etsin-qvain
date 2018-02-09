import React, { Component } from 'react'
import styled from 'styled-components'

const Container = styled.div`
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

const PathButton = styled.button``

export default class Breadcrumbs extends Component {
  pathItems(path, i, id) {
    if (!path) {
      return (
        <Path key={`path-home-${i}`}>
          <PathButton
            className="btn btn-transparent-alt"
            onClick={() => this.props.callback()}
          >
            Home
          </PathButton>
        </Path>
      )
    }
    if (this.props.path.length - 1 === i) {
      return (
        <Path key={`${path}-${i}`}>
          <span>{'>'}</span>
          <PathButton className="btn btn-transparent-alt">{path}</PathButton>
        </Path>
      )
    }
    return (
      <Path key={`${path}-${i}`}>
        <span>{'>'}</span>
        <PathButton
          className="btn btn-transparent-alt"
          onClick={() => this.props.callback(path, id)}
        >
          {path}
        </PathButton>
      </Path>
    )
  }

  render() {
    return (
      <Container className="light-border">
        {this.pathItems()}
        {this.props.path.map((single, index) =>
          this.pathItems(single, index, this.props.ids[index])
        )}
      </Container>
    )
  }
}
