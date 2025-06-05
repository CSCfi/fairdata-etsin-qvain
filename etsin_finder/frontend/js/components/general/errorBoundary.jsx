import { Component } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Translate from '@/utils/Translate'

/*
 * Error boundary component that renders an error instead of crashing
 * the entire app when a child component fails.
 *
 * Implemented as a class component because there is currently no way to write
 * an error boundary as a function component.
 * See https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null, info: null, showDetails: false }
    this.clearError = this.clearError.bind(this)
  }

  componentDidCatch(error, info) {
    this.setState({ error, info })
    if (this.props.callback) {
      this.props.callback(error, info, this.clearError)
    }
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
    if (this.props.callback) {
      this.props.callback(null, null, null)
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
  children: PropTypes.node,
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
  children: null,
}

const ErrorDetails = styled.p`
  white-space: pre-wrap;
  text-align: left;
  word-break: break-all;
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
