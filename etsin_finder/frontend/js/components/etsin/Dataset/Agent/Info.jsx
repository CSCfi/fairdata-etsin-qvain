import React from 'react'
import { observer } from 'mobx-react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Translate from '@/utils/Translate'

import { useStores } from '@/stores/stores'

export const Info = ({ icon, children, title }) => (
  <StyledInfo>
    <Translate component={InfoIconWrapper} attributes={{ 'aria-label': title }}>
      <FontAwesomeIcon icon={icon} />
    </Translate>
    <dd>{children}</dd>
  </StyledInfo>
)

Info.propTypes = {
  icon: PropTypes.object.isRequired,
  children: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
}

export const InfoItem = observer(({ content }) => {
  const {
    Locale: { getValueTranslationWithLang },
  } = useStores()
  const [translatedContent, lang] = getValueTranslationWithLang(content)

  return <div lang={lang}>{translatedContent}</div>
})

InfoItem.propTypes = {
  content: PropTypes.object.isRequired,
}

export const InfoLink = observer(({ document }) => {
  const { title, description, identifier } = document
  const {
    Locale: { getValueTranslationWithLang },
  } = useStores()

  const [translatedTitle, titleLang] = getValueTranslationWithLang(title)
  const [translatedDescription, descriptionLang] = getValueTranslationWithLang(description)

  return (
    <a
      href={identifier}
      target="_blank"
      rel="noopener noreferrer"
      lang={descriptionLang}
      title={translatedDescription || identifier}
    >
      <span lang={titleLang}>{translatedTitle || identifier}</span>
    </a>
  )
})

InfoLink.propTypes = {
  document: PropTypes.shape({
    title: PropTypes.object,
    description: PropTypes.object,
    identifier: PropTypes.string.isRequired,
  }).isRequired,
}

const StyledInfo = styled.div`
  display: flex;
  &:first-of-type {
    margin-top: 0.5em;
  }
`
const InfoIconWrapper = styled.dt`
  width: 1.2em;
  flex-shrink: 0;
  margin-right: 0.7em;
  color: ${p => p.theme.color.dark};
  text-align: center;
`
