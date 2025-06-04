import propTypes from 'prop-types'
import styled from 'styled-components'

import { useStores } from '@/stores/stores'
import CustomMarkdown from './customMarkdown'

const REMSLicense = ({ license, isDataAccessTerms = false }) => {
  const {
    Locale: { getPreferredLang },
  } = useStores()

  const lang = getPreferredLang(license.localizations)
  const localization = license.localizations[lang]
  const title = localization.title
  const textcontent = localization.textcontent
  if (license.licensetype === 'text') {
    const cls = isDataAccessTerms ? 'heading2' : 'heading3'
    return (
      <details open>
        <summary className={cls}>{title}</summary>
        <LicenseMarkdown>{textcontent}</LicenseMarkdown>
      </details>
    )
  }

  if (license.licensetype === 'link') {
    const url = localization.textcontent
    return (
      <>
        <h3>{title}</h3>
        <a href={url} target="_blank" rel="noopener noreferrer" lang={lang}>
          {url}
        </a>
      </>
    )
  }
  throw new Error('Unsupported license type')
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
