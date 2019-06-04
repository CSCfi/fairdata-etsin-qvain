export const getCurrentValue = (field, options, lang) => {
  let current
  if (field !== undefined && options[lang] !== undefined) {
    current = options[lang].find(opt => opt.value === field.url)
  }
  if (current === undefined && field !== undefined) {
    let label
    if (field.name !== undefined) {
      label = field.name[lang] || Object.values(field.name)[0]
    } else {
      label = undefined
    }
    current = {
      value: field.url,
      label
    }
  }
  return current
}

export const onChange = (options, lang, callback, constructFunc) => (selection) => {
  const name = {}
  name[lang] = selection.label
  const otherLocales = Object.keys(options).filter(o => o !== lang)
  if (otherLocales.length > 0) {
    name[otherLocales[0]] = options[otherLocales[0]].find(o => o.value === selection.value).label
  }
  callback(constructFunc(name, selection.value))
}
