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

import React from 'react'
import styled from 'styled-components'
import Translate from 'react-translate-component'
import translate from 'counterpart'
import PropTypes from 'prop-types'

import ErrorBoundary from '../../../general/errorBoundary'

const ErrorContainer = styled.div.attrs({
  className: 'error',
})`
  text-align: left;
  && {
    padding-left: 2rem;
    padding-right: 2rem;
    margin-top: 1.25rem;
  }
`

const getTitle = field => (
  <Translate component="h3" content="qvain.error.component" with={{ field }} />
)

export const FieldErrorBoundary = ({ children, field }) => {
  const title = getTitle(translate(field))

  return (
    <ErrorBoundary ContainerComponent={ErrorContainer} title={title}>
      {children}
    </ErrorBoundary>
  )
}

FieldErrorBoundary.propTypes = {
  field: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
}

export const withFieldErrorBoundaryTranslationList = []

export const withFieldErrorBoundary = (Component, translation) => {
  const ErrorBoundaryComponent = props => (
    <FieldErrorBoundary field={translation}>
      <Component {...props} />
    </FieldErrorBoundary>
  )
  ErrorBoundaryComponent.displayName = `withFieldErrorBoundary(${
    Component.displayName || Component.name || 'Component'
  })`
  ErrorBoundaryComponent.wrappedComponent = Component
  if (!withFieldErrorBoundaryTranslationList.includes(translation)) {
    withFieldErrorBoundaryTranslationList.push(translation)
  }
  return ErrorBoundaryComponent
}

export default FieldErrorBoundary
