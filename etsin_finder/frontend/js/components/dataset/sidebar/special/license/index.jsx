import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { LICENSE_URL } from '@/utils/constants'
import isUrl from '@/utils/isUrl'
import LicensePopUp from './licensePopUp'
import { useStores } from '@/stores/stores'

const License = props => {
  const {
    Locale: { getPreferredLang, getValueTranslation },
  } = useStores()
  const {
    data: { license, title, description, identifier },
  } = props
  const licenseIsUrl = isUrl(license)

  let info
  if (identifier === LICENSE_URL.OTHER) {
    info = 'dataset.otherLicense'
  }

  return (
    <span>
      {licenseIsUrl && (
        <MainLink
          href={license}
          target="_blank"
          rel="noopener noreferrer"
          lang={getPreferredLang(title)}
        >
          {getValueTranslation(title)}
          {!getValueTranslation(title) && getValueTranslation(license)}
        </MainLink>
      )}
      {!licenseIsUrl && (
        <Title lang={getPreferredLang(title)}>
          {getValueTranslation(title)}
          {!getValueTranslation(title) && getValueTranslation(license)}
        </Title>
      )}
      <LicensePopUp license={license} title={title} description={description} info={info} />
    </span>
  )
}

License.propTypes = {
  data: PropTypes.shape({
    license: PropTypes.string,
    title: PropTypes.object,
    identifier: PropTypes.string, // custom license might not have an identifier
    description: PropTypes.object,
  }).isRequired,
}

const MainLink = styled.a`
  color: 'lightblue';
  margin-right: 0.2em;
`

const Title = styled.span`
  margin-right: 0.2em;
`

export default License
