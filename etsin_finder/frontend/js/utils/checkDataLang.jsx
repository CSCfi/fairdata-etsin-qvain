// checks if there is a translation available for specific language.
// if no language is specified, uses current language.

import Locale from 'Stores/view/language'

const checkDataLang = (object, lang) => {
  let language = lang
  if (!lang) {
    language = Locale.currentLang
  }
  if (typeof object === 'undefined' || Object.keys(object).length === 0) {
    return ''
  } else if (typeof object === 'string') {
    return object
  } else if (object[language]) return object[language]
  return object[Object.keys(object)[0]]
}

export default checkDataLang
