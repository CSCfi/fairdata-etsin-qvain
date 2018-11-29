import React from 'react'
import checkDataLang, { selectedDataLang } from '../../utils/checkDataLang'
import PropTypes from 'prop-types'

const GetLang = ({ content, render }) => {
  // if content is type of array
  if (Array.isArray(content)) {
    const languages = []
    const translations = []
    for (const item of content) {
      languages.push(selectedDataLang(item))
      translations.push(checkDataLang(item))
    }
    return <React.Fragment>{render({ lang: languages, translation: translations })}</React.Fragment>
  }
  return (
    <React.Fragment>
      {render({ lang: selectedDataLang(content), translation: checkDataLang(content) })}
    </React.Fragment>
  )
}

GetLang.propTypes = {
  content: PropTypes.oneOf(PropTypes.object, PropTypes.array).isRequired,
  render: PropTypes.func.isRequired,
}

export default GetLang
