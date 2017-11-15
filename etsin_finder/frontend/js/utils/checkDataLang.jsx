import Store from '../stores'

const checkDataLang = (object, lang) => {
  let language = lang
  if (!lang) {
    language = Store.Locale.currentLang
  }
  return object[language]
    ? object[language]
    : object[Object.keys(object)[0]]
}


export default checkDataLang
