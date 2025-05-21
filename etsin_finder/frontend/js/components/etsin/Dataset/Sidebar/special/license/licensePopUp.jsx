import { useState } from 'react'
import PropTypes from 'prop-types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons'
import styled from 'styled-components'
import Translate from '@/utils/Translate'

import PopUp from '@/components/general/popup'
import { LinkButton } from '@/components/general/button'
import isUrl from '@/utils/isUrl'
import { useStores } from '@/stores/stores'

const LicensePopUp = ({ license, title, description, info }) => {
  const {
    Locale: { getPreferredLang, getValueTranslation },
  } = useStores()
  const [popUpOpen, setPopUpOpen] = useState(false)

  const togglePopup = () => setPopUpOpen(!popUpOpen)
  const closePopUp = () => setPopUpOpen(false)

  if (!description && !info) {
    return null
  }

  let link
  if (license && isUrl(license)) {
    link = license
  }

  const popUpContent = (
    <div>
      {title && <Name lang={getPreferredLang(title)}>{getValueTranslation(title)}</Name>}
      {description && (
        <Description lang={getPreferredLang(description)}>
          {getValueTranslation(description)}
        </Description>
      )}
      {info && <Translate component={Description} content={info} />}

      {link && (
        <Link href={link} target="_blank" rel="noopener noreferrer">
          {link}
        </Link>
      )}
      {!link && license}
    </div>
  )

  return (
    <PopUp
      popUp={popUpContent}
      isOpen={popUpOpen}
      onRequestClose={closePopUp}
      align="sidebar"
      role="dialog"
    >
      <LinkButton onClick={togglePopup} noMargin noPadding aria-haspopup="dialog">
        <Translate
          component={FontAwesomeIcon}
          icon={faInfoCircle}
          attributes={{ title: 'dataset.additionalInformation' }}
        />
      </LinkButton>
    </PopUp>
  )
}

LicensePopUp.propTypes = {
  license: PropTypes.string,
  title: PropTypes.object,
  description: PropTypes.object,
  info: PropTypes.string,
}

LicensePopUp.defaultProps = {
  license: null,
  title: null,
  description: null,
  info: null,
}

const Name = styled.h4`
  margin-bottom: 0;
  font-size: 1.1em;
  color: ${p => p.theme.color.dark};
  line-height: 1.25;
  min-width: 20em;
`

const Link = styled.a`
  font-size: 0.9em;
`

const Description = styled.p`
  margin-top: 0.5em;
  margin-bottom: 0.5em;
  font-size: 0.9em;
`

export default LicensePopUp
