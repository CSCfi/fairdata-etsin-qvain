import Locale from '../stores/view/language'

const checkDataLang = (object, lang) => {
  let language = lang
  if (!lang) {
    language = Locale.currentLang
  }
  if (typeof object === 'undefined' || Object.keys(object).length === 0) {
    return ''
  } else if (object[language]) return object[language]
  return object[Object.keys(object)[0]]
}

export default checkDataLang
