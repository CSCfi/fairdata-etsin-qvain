import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Translate from 'react-translate-component'

class TranslationTab extends Component {
  static propTypes = {
    language: PropTypes.string.isRequired,
    setLanguage: PropTypes.func.isRequired,
    children: PropTypes.object.isRequired
  }

  translations = {
    langButtonFi: 'qvain.general.langFi',
    langButtonEn: 'qvain.general.langEn'
  }

  render() {
    const { language, setLanguage, children } = this.props;
    return (
      <React.Fragment>
        <LangButtonContainer>
          <LangButton active={language === 'fi'} onClick={() => setLanguage('fi')}>
            <Translate content={this.translations.langButtonFi} />
          </LangButton>
          <EmptyBlock width="2%" />
          <LangButton active={language === 'en'} onClick={() => setLanguage('en')}>
            <Translate content={this.translations.langButtonEn} />
          </LangButton>
          <EmptyBlock width="48%" />
        </LangButtonContainer>
        <ContentCard>{children}</ContentCard>
      </React.Fragment>
    )
  }
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
