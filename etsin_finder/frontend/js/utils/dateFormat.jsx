{
/**
 * This file is part of the Etsin service
 *
 * Copyright 2017-2018 Ministry of Education and Culture, Finland
 *
 *
 * @author    CSC - IT Center for Science Ltd., Espoo Finland <servicedesk@csc.fi>
 * @license   MIT
 */
}

import Locale from '../stores/view/language'

const formats = {
  fi: {
    lang: 'fi-FI',
    options: { day: 'numeric', month: 'numeric', year: 'numeric' },
  },
  en: {
    lang: 'en-US',
    options: { year: 'numeric', month: 'long', day: 'numeric' },
  },
}

const dateFormat = date => {
  if (!date) {
    return ''
  }
  if (date.length === 4) {
    return new Date(date).getFullYear()
  }
  if (Locale.currentLang === 'en') {
    return new Date(date).toLocaleDateString(
      formats[Locale.currentLang].lang,
      formats[Locale.currentLang].options
    )
  }
  const itemDate = new Date(date)
  const day = itemDate.getDate()
  const month = itemDate.getMonth()
  const year = itemDate.getFullYear()
  const finnishFormat = `${day}.${month + 1}.${year}`
  return finnishFormat
}

export default dateFormat
