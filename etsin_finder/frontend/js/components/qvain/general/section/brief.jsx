import React from 'react'
import Translate from 'react-translate-component'
import PropTypes from 'prop-types'

const Brief = ({ title, description }) => (
  <>
    <Translate tabIndex="0" component="h3" content={title} />
    <Translate component="p" content={description} />
  </>
)

Brief.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
}

export default Brief
