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

import React from 'react'
import Stores from '../stores'

const { Locale } = Stores

const getFormats = shortMonth => ({
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
        month: shortMonth ? 'short' : 'long',
        day: 'numeric',
      },
    },
  },
})

const getDefaultFormat = date => {
  if (typeof date === 'string' || date instanceof String) {
    if (date.length === 4) {
      return 'year'
    }
    if (date.length <= 10) {
      return 'date'
    }
  }
  return 'datetime'
}

const dateFormat = (date, { shortMonth = false, format } = {}) => {
  const formats = getFormats(shortMonth)
  if (!date) {
    return ''
  }
  const outputFormat = format || getDefaultFormat(date)
  if (outputFormat === 'year') {
    return new Date(date).getFullYear()
  }
  if (outputFormat === 'date') {
    return new Date(date).toLocaleDateString(
      formats.date[Locale.currentLang].lang,
      formats.date[Locale.currentLang].options
    )
  }
  return new Date(date).toLocaleString(
    formats.datetime[Locale.currentLang].lang,
    formats.datetime[Locale.currentLang].options
  )
}

export function dateSeparator(start, end) {
  if (start || end) {
    return (start === end) 
      ? <>{dateFormat(start, { format: 'date' })}</> 
      : <>{`${dateFormat(start, { format: 'date' })} - ${dateFormat(end, { format: 'date' })}`}</>
  }
  return null
}

export default dateFormat
