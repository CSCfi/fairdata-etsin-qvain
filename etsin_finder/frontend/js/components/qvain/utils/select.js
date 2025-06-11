// If label is missing from selected option, use one from the options if available.
// Allows having default options without requiring hardcoded labels.
export const getCurrentOption = (model, options, getter) => {
  if (Array.isArray(getter)) {
    return getter.map(value => getSingleOption(model, options, value))
  }
  return getSingleOption(model, options, getter)
}

const getSingleOption = (model, options, value) => {
  if (!value) {
    return value
  }
  const [labelKey, urlKey] = Object.keys(model())
  if (value[labelKey]) {
    return value
  }
  if (value[urlKey]) {
    const url = value[urlKey]
    const selected = options.find(opt => opt[urlKey] === url)
    if (selected) {
      return selected
    }
  }
  return value
}

// Call setter for single item
export const onChange = callback => selection => {
  if (selection !== null) {
    callback(selection)
  } else {
    callback(undefined)
  }
}

// Call setter for array
export const onChangeMulti = callback => selection => {
  if (!selection) {
    callback([])
    return
  }
  callback(selection)
}

// Get label for option, assumes that first key of model corresponds to label
export const getOptionLabel = (model, lang) => {
  const [labelKey, urlKey] = Object.keys(model())
  return opt => {
    if (!opt) {
      return undefined
    }
    if (opt[labelKey]) {
      return opt[labelKey][lang] || opt[labelKey].und || Object.values(opt[labelKey])[0]
    }
    return opt[urlKey]
  }
}

// Get label for option, assumes that first key of model corresponds to label
export const getGroupLabel = (model, lang) => getOptionLabel(model, lang)

// Get label for option, assumes that second key of model corresponds to url
export const getOptionValue = model => {
  const urlKey = Object.keys(model())[1]
  return opt => opt[urlKey]
}

export const optionsToModels = (model, options) => {
  if (Array.isArray(options)) {
    return options.map(opt => model(opt.label, opt.value))
  }
  return model(options.label, options.value)
}

const getCollator = lang => new Intl.Collator(lang, { numeric: true, sensitivity: 'base' })

// Sort groups array and their options in-place according to lang
export const sortGroups = async (
  lang,
  groups,
  { optionKey, translateOptionKey, groupKey = 'label', translateGroupKey = true } = {}
) => {
  groups.forEach(group => {
    if (group.options.length > 0) {
      sortOptions(lang, group.options, { key: optionKey, translateKey: translateOptionKey })
    }
  })

  const collator = getCollator(lang)
  if (translateGroupKey) {
    groups.sort((a, b) => collator.compare(a[groupKey][lang], b[groupKey][lang]))
  } else {
    groups.sort((a, b) => collator.compare(a[groupKey], b[groupKey]))
  }
}

// Sort options array in-place according to lang
export const sortOptions = async (
  lang,
  options,
  { sortFunc = null, key = 'label', translateKey = true } = {}
) => {
  if (sortFunc) {
    options.sort(sortFunc)
  } else {
    const collator = getCollator(lang)
    if (translateKey) {
      options.sort((a, b) => collator.compare(a[key][lang], b[key][lang]))
    } else {
      options.sort((a, b) => collator.compare(a[key], b[key]))
    }
  }
}
