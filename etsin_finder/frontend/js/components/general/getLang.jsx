import React from 'react'
import checkDataLang, { selectedDataLang } from '../../utils/checkDataLang'
import PropTypes from 'prop-types'

const GetLang = ({ content, render }) => (
  <React.Fragment>
    {render({ lang: selectedDataLang(content), translation: checkDataLang(content) })}
  </React.Fragment>
)

GetLang.propTypes = {
  content: PropTypes.object.isRequired,
  render: PropTypes.func.isRequired,
}

export default GetLang
