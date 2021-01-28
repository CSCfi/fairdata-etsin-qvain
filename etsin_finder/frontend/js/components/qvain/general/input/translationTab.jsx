import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Translate from 'react-translate-component'
import { observer } from 'mobx-react'

import { useStores } from '../../utils/stores'

const TranslationTab = ({ language, setLanguage, children }) => {
  const {
    Locale: { langTabOrder: languages },
  } = useStores()

  const translations = {
    fi: 'qvain.general.langFi',
    en: 'qvain.general.langEn',
  }

  return (
    <>
      <LangButtonContainer>
        <LangButton
          type="button"
          active={language === languages[0]}
          onClick={() => setLanguage(languages[0])}
          language={languages[0]}
        >
          <Translate content={translations[languages[0]]} />
        </LangButton>
        <EmptyBlock width="2%" />
        <LangButton
          type="button"
          active={language === languages[1]}
          onClick={() => setLanguage(languages[1])}
          language={languages[1]}
        >
          <Translate content={translations[languages[1]]} />
        </LangButton>
        <EmptyBlock width="50%" />
      </LangButtonContainer>
      <ContentCard>{children}</ContentCard>
    </>
  )
}

TranslationTab.propTypes = {
  language: PropTypes.string.isRequired,
  setLanguage: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
}

const ContentCard = styled.div`
  margin-bottom: 15px;
  padding: 25px 44px;
  border: 1px solid #007fad;
  border-top: none;
  min-height: 150px;
  background-color: #fff;
  overflow: auto;
`

const LangButtonContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
`
const LangButton = styled.button`
  flex-grow: 1;
  width: 25%;
  padding: 5px 20px;
  background-color: #fff;
  border: 1px solid ${props => (props.active ? '#007fad' : '#cccccc')};
  border-bottom: ${props => (props.active ? 'none' : '1px solid #007fad')};
  border-radius: 4px 4px 0 0;
`
const EmptyBlock = styled.div`
  width: ${props => props.width};
  border-bottom: 1px solid #007fad;
`

export default observer(TranslationTab)
