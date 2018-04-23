import React, { Component, Fragment } from 'react'
import styled from 'styled-components'
import Translate from 'react-translate-component'
import translate from 'counterpart'
import PropTypes from 'prop-types'

import { TransparentButton } from '../../general/button'

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
          <TransparentButton onClick={() => this.props.callback()}>
            <Translate className="screen-reader-only" content="dataset.dl.file_types.directory" />Home
          </TransparentButton>
        </Path>
      )
    }

    if (this.props.path.length - 1 === i) {
      return (
        <Fragment key={`${path}-${i}`}>
          <Path>
            <Arrow>{'>'}</Arrow>
          </Path>
          <Path>
            <TransparentButton aria-current="true">
              <Translate className="screen-reader-only" content="dataset.dl.file_types.directory" />
              {path}
            </TransparentButton>
          </Path>
        </Fragment>
      )
    }

    return (
      <Fragment key={`${path}-${i}`}>
        <Path>
          <Arrow>{'>'}</Arrow>
        </Path>
        <Path>
          <TransparentButton onClick={() => this.props.callback(path, id)}>
            <Translate className="screen-reader-only" content="dataset.dl.file_types.directory" />
            {path}
          </TransparentButton>
        </Path>
      </Fragment>
    )
  }

  render() {
    return (
      <Container aria-label={translate('dataset.dl.breadcrumbs')} className="light-border">
        {this.pathItems()}
        {this.state.sliced ? (
          <Rest>
            <Path>
              <Arrow>{'>'}</Arrow>
            </Path>
            <Path>
              <TransparentButton aria-label="rest" disabled>
                ...
              </TransparentButton>
            </Path>
          </Rest>
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

const Container = styled.nav`
  padding: 0.5em 1.1em;
  width: 100%;
  border-top: 0px;
  border-bottom: 0px;
  display: flex;
  align-content: center;
  flex-wrap: wrap;
`
const Path = styled.div`
  display: flex;
  button {
    padding-left: 0;
    padding-right: 0;
  }
`
const Arrow = styled.span`
  padding: 0 0.4em;
  align-self: center;
  color: ${props => props.theme.color.gray};
`

const Rest = styled.div`
  display: flex;
`

Breadcrumbs.propTypes = {
  callback: PropTypes.func.isRequired,
  path: PropTypes.array.isRequired,
}
