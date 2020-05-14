import React from 'react'
import Translate from 'react-translate-component'
import PropTypes from 'prop-types'
import InfrastructureSelection from './InfrastructureSelection'

const InfrastructureFieldContent = ({ title, description }) => (
  <>
    <Translate tabIndex="0" component="h3" content={title} />
    <Translate component="p" content={description} />
    <InfrastructureSelection />
  </>
)

InfrastructureFieldContent.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
}

export default InfrastructureFieldContent
