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
import { observer } from 'mobx-react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import translate from 'counterpart'

import { TransparentButton, InvertedButton } from '../button'
import { useStores } from '../../../utils/stores'

const LangToggle = ({ inverted, margin, mobile }) => {
  const { Locale } = useStores()
  const changeLang = () => {
    Locale.toggleLang({ save: true })
  }

  const otherLang = () =>
    Locale.languages.map(lang => {
      if (lang !== Locale.currentLang) {
        return <Lang key={lang}>{lang}</Lang>
      }
      return null
    })

  const labelId = mobile ? 'sr-text-for-language-toggle-mobile' : 'sr-text-for-language-toggle'

  return (
    <>
      <span className="sr-only" id={labelId}>
        {translate('general.language.toggleLabel', {
          otherLang:
            Locale.currentLang === 'fi'
              ? translate('qvain.general.langEn')
              : translate('qvain.general.langFi'),
        })}
      </span>
      {inverted ? (
        <InvertedButton
          color="dark"
          margin={margin}
          padding="0.3em 1em 0.4em"
          onClick={changeLang}
          aria-labelledby={labelId}
        >
          {otherLang()}
        </InvertedButton>
      ) : (
        <TransparentButton onClick={changeLang} margin={margin} aria-labelledby={labelId}>
          {otherLang()}
        </TransparentButton>
      )}
    </>
  )
}

const Lang = styled.span`
  border-left: 1px solid ${p => p.theme.color.dark};
  text-transform: uppercase;
  &:first-of-type {
    border-left: none;
  }
`

LangToggle.propTypes = {
  inverted: PropTypes.bool,
  margin: PropTypes.string,
  mobile: PropTypes.bool,
}

LangToggle.defaultProps = {
  inverted: false,
  margin: '0.3em 0.3em',
  mobile: false,
}

export default observer(LangToggle)
