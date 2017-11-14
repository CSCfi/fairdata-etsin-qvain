import Store from '../stores'

const checkDataLang = object => (
  object[Store.Locale.currentLang]
    ? object[Store.Locale.currentLang]
    : object[Object.keys(object)[0]]
)

export default checkDataLang
