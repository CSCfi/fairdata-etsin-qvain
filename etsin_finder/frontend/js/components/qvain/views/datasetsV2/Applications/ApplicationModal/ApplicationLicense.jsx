import { useStores } from '@/stores/stores'
import { observer } from 'mobx-react'
import styled from 'styled-components'

import CustomMarkdown from '@/components/etsin/Dataset/Description/customMarkdown'

const LicenseMarkdown = styled(CustomMarkdown).attrs({
  components: { h1: 'h4', h2: 'h5', h3: 'h6', h4: 'h6', h5: 'h6' },
})`
  margin-bottom: 1rem;
`

const ApplicationLicense = observer(({ license }) => {
  const {
    Locale: { getValueTranslationWithLang },
  } = useStores()

  const type = license['license/type']
  const [title, titleLang] = getValueTranslationWithLang(license['license/title'])
  if (type === 'text') {
    const [text, lang] = getValueTranslationWithLang(license['license/text'])
    const cls = 'heading4'
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
        <h4 lang={titleLang}>{title}</h4>
        <a href={url} target="_blank" rel="noopener noreferrer" lang={lang}>
          {url}
        </a>
      </>
    )
  }

  return <h3 lang={titleLang}>{title}</h3>
})

export default ApplicationLicense
