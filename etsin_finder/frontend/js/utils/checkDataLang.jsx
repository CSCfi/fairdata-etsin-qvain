const checkDataLang = (object, lang) => {
  if (typeof object === 'undefined' || Object.keys(object).length === 0) return '';
  else if (object[lang]) return object[lang];
  return object[Object.keys(object)[0]];
}

export default checkDataLang
