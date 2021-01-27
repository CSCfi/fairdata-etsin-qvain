{
  /**
   * This file is part of the Etsin service
   *
   * Copyright 2017-2018 Ministry of Education and Culture, Finland
   *
   *
   * @author    CSC - IT Center for Science Ltd., Espoo Finland <servicedesk@csc.fi>
   * @license   MIT
   */
}

import React, { Component } from 'react'
import Translate from 'react-translate-component'
import PropTypes from 'prop-types'
import styled from 'styled-components'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null, info: null, showDetails: false }
  }

  setShowDetails(value) {
    this.setState({ showDetails: value })
  }

  errorDetails() {
    const { error, info } = this.state
    if (!error) {
      return ''
    }
    const errorParts = []
    if (error.stack) {
      errorParts.push(error.stack)
    } else {
      errorParts.push(error.toString())
    }
    const components = info?.componentStack
    if (components) {
      errorParts.push(`Component stack: ${components}`)
    }
    return errorParts.join('\n\n')
  }

  clearError() {
    this.setState({ error: null, info: null, showDetails: false })
  }

  componentDidCatch(error, info) {
    this.setState({ error, info })
    window.e = error
    window.i = info
    if (this.props.callback) {
      this.props.callback(error, info)
    }
  }

  render() {
    const { title, ContainerComponent } = this.props
    const { showDetails } = this.state

    const detailsAction = `error.details.${showDetails ? 'hideDetails' : 'showDetails'}`

    const { error } = this.state
    if (error) {
      return (
        <ContainerComponent>
          {title}
          {showDetails && <ErrorDetails>{this.errorDetails()}</ErrorDetails>}
          <Translate
            component={DetailsButton}
            content={detailsAction}
            onClick={() => this.setShowDetails(!showDetails)}
          />
        </ContainerComponent>
      )
    }
    return this.props.children
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.node,
  ContainerComponent: PropTypes.elementType,
  callback: PropTypes.func,
}

const ErrorContainer = styled.div.attrs({
  className: 'error',
})`
  && {
    padding-left: 2rem;
    padding-right: 2rem;
  }
`

ErrorBoundary.defaultProps = {
  title: <Translate component="h2" content="error.undefined" />,
  ContainerComponent: ErrorContainer,
  callback: null,
}

const ErrorDetails = styled.p`
  white-space: pre-wrap;
  text-align: left;
`

const DetailsButton = styled.button.attrs({
  type: 'button',
})`
  background: none;
  color: inherit;
  border: none;
  font-weight: 700;
  border: 1px solid white;
  border-radius: 4px;
  padding: 0.25rem 0.75rem;
  cursor: pointer;
`
