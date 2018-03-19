import Locale from 'Stores/view/language'

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
