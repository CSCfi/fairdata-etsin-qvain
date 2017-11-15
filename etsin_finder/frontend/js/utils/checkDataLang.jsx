const checkDataLang = (object, lang) => (
  object[lang]
    ? object[lang]
    : object[Object.keys(object)[0]]
)

export default checkDataLang
