import propTypes from 'prop-types'
import styled from 'styled-components'

import { useStores } from '@/stores/stores'
import CustomMarkdown from '../Description/customMarkdown'

const REMSLicense = ({ license, isDataAccessTerms = false }) => {
  const {
    Locale: { getValueTranslationWithLang },
  } = useStores()
  const type = license['license/type']
  const [title, titleLang] = getValueTranslationWithLang(license['license/title'])
  if (type === 'text') {
    const [text, lang] = getValueTranslationWithLang(license['license/text'])
    const cls = isDataAccessTerms ? 'heading2' : 'heading3'
    return (
      <details open>
        <summary className={cls} lang={titleLang}>
          {title}
        </summary>
        <LicenseMarkdown lang={lang}>{text}</LicenseMarkdown>
      </details>
    )
  }

  if (type === 'link') {
    const [url, lang] = getValueTranslationWithLang(license['license/link'])
    return (
      <>
        <h3 lang={titleLang}>{title}</h3>
        <a href={url} target="_blank" rel="noopener noreferrer" lang={lang}>
          {url}
        </a>
      </>
    )
  }
  throw new Error(`Unsupported license type: ${type}`)
}

REMSLicense.propTypes = {
  license: propTypes.object.isRequired,
  isDataAccessTerms: propTypes.bool,
}

const LicenseMarkdown = styled(CustomMarkdown).attrs({
  components: { h1: 'h4', h2: 'h5', h3: 'h6', h4: 'h6', h5: 'h6' },
})`
  margin-bottom: 1rem;
`

export default REMSLicense
