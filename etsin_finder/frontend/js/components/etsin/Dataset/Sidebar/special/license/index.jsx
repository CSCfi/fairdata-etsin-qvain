import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { LICENSE_URL } from '@/utils/constants'
import isUrl from '@/utils/isUrl'
import LicensePopUp from './licensePopUp'
import { useStores } from '@/stores/stores'

const License = ({ license }) => {
  const {
    Locale: { getPreferredLang, getValueTranslation },
  } = useStores()
  const licenseIsUrl = isUrl(license.custom_url)

  let info
  if (license.url === LICENSE_URL.OTHER) {
    info = 'dataset.otherLicense'
  }

  const lang = getPreferredLang(license.pref_label)
  const name =
    getValueTranslation(license.pref_label, lang) || getValueTranslation(license.custom_url, lang)

  return (
    <span>
      {licenseIsUrl && (
        <MainLink href={license.custom_url} target="_blank" rel="noopener noreferrer" lang={lang}>
          {name}
        </MainLink>
      )}
      {!licenseIsUrl && <Title lang={lang}>{name}</Title>}
      <LicensePopUp
        license={license.custom_url}
        title={license.pref_label}
        description={license.description}
        info={info}
      />
    </span>
  )
}

License.propTypes = {
  license: PropTypes.shape({
    custom_url: PropTypes.string,
    pref_label: PropTypes.object,
    url: PropTypes.string, // custom license might not have a url
    description: PropTypes.object,
  }).isRequired,
}

const MainLink = styled.a`
  margin-right: 0.2em;
`

const Title = styled.span`
  margin-right: 0.2em;
`

export default License
