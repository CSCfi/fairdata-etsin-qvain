import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Translate from 'react-translate-component'

const TranslationTab = ({ language, setLanguage, children }) => {
  const translations = {
    langButtonFi: 'qvain.general.langFi',
    langButtonEn: 'qvain.general.langEn',
  }

  return (
    <React.Fragment>
      <LangButtonContainer>
        <LangButton type="button" active={language === 'fi'} onClick={() => setLanguage('fi')}>
          <Translate content={translations.langButtonFi} />
        </LangButton>
        <EmptyBlock width="2%" />
        <LangButton type="button" active={language === 'en'} onClick={() => setLanguage('en')}>
          <Translate content={translations.langButtonEn} />
        </LangButton>
        <EmptyBlock width="48%" />
      </LangButtonContainer>
      <ContentCard>{children}</ContentCard>
    </React.Fragment>
  )
}

TranslationTab.propTypes = {
  language: PropTypes.string.isRequired,
  setLanguage: PropTypes.func.isRequired,
  children: PropTypes.oneOfType([PropTypes.object, PropTypes.array]).isRequired,
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

export default TranslationTab
