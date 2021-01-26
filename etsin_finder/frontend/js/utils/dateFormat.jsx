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

import { Locale } from '../stores'

const formats = {
  datetime: {
    fi: {
      lang: 'fi-FI',
      options: {
        day: 'numeric',
        month: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        seconds: '2-digit',
      },
    },
    en: {
      lang: 'en-US',
      options: {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        seconds: '2-digit',
      },
    },
  },
  date: {
    fi: {
      lang: 'fi-FI',
      options: {
        day: 'numeric',
        month: 'numeric',
        year: 'numeric',
      },
    },
    en: {
      lang: 'en-US',
      options: {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      },
    },
  },
}

const dateFormat = date => {
  if (!date) {
    return ''
  }
  let out = date
  if ((typeof out === 'string' || out instanceof String) && out.endsWith('-00:00')) {
    out = out.substring(0, out.length - 6)
  }
  if (out.length === 4) {
    return new Date(out).getFullYear()
  }
  if (out.length <= 10) {
    return new Date(out).toLocaleDateString(
      formats.date[Locale.currentLang].lang,
      formats.date[Locale.currentLang].options
    )
  }
  return new Date(out).toLocaleString(
    formats.datetime[Locale.currentLang].lang,
    formats.datetime[Locale.currentLang].options
  )
}

export default dateFormat
