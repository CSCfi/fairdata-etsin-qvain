import React, { Component } from 'react'
import styled from 'styled-components'

const Container = styled.div`
  padding: 0.5em 1.2em;
  border-top: 0px;
  border-bottom: 0px;
`

export default class Breadcrumbs extends Component {
  render() {
    return <Container className="light-border">{'Home > '}</Container>
  }
}
