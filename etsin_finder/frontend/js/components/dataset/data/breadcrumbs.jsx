import React, { Component, Fragment } from 'react'
import styled from 'styled-components'
import Translate from 'react-translate-component'
import translate from 'counterpart'
import PropTypes from 'prop-types'

import { TransparentButton } from '../../general/button'

export default class Breadcrumbs extends Component {
  slicePath(props) {
    let path = props.path
    let sliced = false
    let ids = props.folderIds
    if (props.path.length > 3) {
      sliced = true
      path = props.path.slice(props.path.length - 3)
      ids = props.folderIds.slice(props.folderIds.length - 3)
    }
    return { path, sliced, ids }
  }

  pathItems(path, i, id) {
    if (!path) {
      return (
        <Path key="path-home">
          <TransparentButton onClick={() => this.props.changeFolder()}>
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
          <TransparentButton onClick={() => this.props.changeFolder(path, id)}>
            <Translate className="screen-reader-only" content="dataset.dl.file_types.directory" />
            {path}
          </TransparentButton>
        </Path>
      </Fragment>
    )
  }

  renderPath() {
    const modified = this.slicePath(this.props)
    return (
      <React.Fragment>
        {this.pathItems()}
        {modified.sliced ? (
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
        {modified.path.map((single, index) => this.pathItems(single, index, modified.ids[index]))}
      </React.Fragment>
    )
  }

  render() {
    return (
      <Container aria-label={translate('dataset.dl.breadcrumbs')} className="light-border">
        {this.renderPath()}
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

/* eslint-disable react/no-unused-prop-types */
Breadcrumbs.propTypes = {
  changeFolder: PropTypes.func.isRequired,
  path: PropTypes.array.isRequired,
  folderIds: PropTypes.array.isRequired,
}
