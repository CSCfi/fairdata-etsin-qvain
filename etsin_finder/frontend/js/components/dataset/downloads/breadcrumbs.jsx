import React, { Component } from 'react'
import styled from 'styled-components'
import translate from 'counterpart'
import { TransparentButton } from '../../general/button'

const Container = styled.nav`
  padding: 0.5em 0.5em;
  width: 100%;
  border-top: 0px;
  border-bottom: 0px;
  display: inline-flex;
  overflow-x: hidden;
  align-content: center;
`
const Path = styled.div`
  display: flex;
`
const Arrow = styled.span`
  align-self: center;
  color: ${props => props.theme.color.gray};
`

export default class Breadcrumbs extends Component {
  constructor(props) {
    super(props)
    const modified = this.slicePath(props)
    this.state = {
      ids: modified.ids,
      path: modified.path,
      sliced: modified.sliced,
    }
  }

  componentWillReceiveProps(newProps) {
    const modified = this.slicePath(newProps)
    this.setState({
      ids: modified.ids,
      path: modified.path,
      sliced: modified.sliced,
    })
  }

  slicePath(props) {
    let path = props.path
    let sliced = false
    let ids = props.ids
    if (props.path.length > 3) {
      sliced = true
      path = props.path.slice(props.path.length - 3)
      ids = props.ids.slice(props.ids.length - 3)
    }
    return { path, sliced, ids }
  }

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
          <Arrow>{'>'}</Arrow>
          <TransparentButton aria-current="true">{path}</TransparentButton>
        </Path>
      )
    }

    return (
      <Path key={`${path}-${i}`}>
        <Arrow>{'>'}</Arrow>
        <TransparentButton onClick={() => this.props.callback(path, id)}>{path}</TransparentButton>
      </Path>
    )
  }

  render() {
    return (
      <Container aria-label={translate('dataset.dl.breadcrumbs')} className="light-border">
        {this.pathItems()}
        {this.state.sliced ? (
          <Path>
            <Arrow>{'>'}</Arrow>
            <TransparentButton aria-label="rest" disabled>
              ...
            </TransparentButton>
          </Path>
        ) : (
          ''
        )}
        {this.state.path.map((single, index) =>
          this.pathItems(single, index, this.state.ids[index])
        )}
      </Container>
    )
  }
}
