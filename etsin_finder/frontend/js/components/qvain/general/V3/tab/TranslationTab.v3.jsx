import { observer } from 'mobx-react'
import PropTypes from 'prop-types'
import React, { Fragment } from 'react'
import styled from 'styled-components'

import { FieldGroup } from '@/components/qvain/general/V2'
import { useStores } from '@/stores/stores'
import withCustomProps from '@/utils/withCustomProps'

const TranslationTab = ({ language, setLanguage, children, useTitleLanguages }) => {
  const {
    Locale: { datasetTitleLanguageTabOrder, languageTabOrder, translate },
  } = useStores()

  const languages = useTitleLanguages ? datasetTitleLanguageTabOrder : languageTabOrder

  return (
    <TabGroup>
      <LangButtonContainer role="tablist">
        {languages.map((lang, index) => (
          <Fragment key={lang}>
            {index !== 0 && <EmptyBlock width="1%" />}
            <LangButton
              id={`tab-${lang}`}
              role="tab"
              type="button"
              active={language === lang}
              onClick={() => setLanguage(lang)}
              language={lang}
            >
              {translate(`qvain.general.lang.${lang}`)}
            </LangButton>
          </Fragment>
        ))}

        <EmptyBlock width="25%" />
      </LangButtonContainer>
      <ContentCard>{children}</ContentCard>
    </TabGroup>
  )
}

TranslationTab.propTypes = {
  language: PropTypes.string.isRequired,
  setLanguage: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  useTitleLanguages: PropTypes.bool,
}

TranslationTab.defaultProps = {
  useTitleLanguages: false,
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

const TabGroup = styled(FieldGroup)`
  margin-top: 0.5rem;
  gap: 0;
`

const LangButton = withCustomProps(styled.button)`
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
