import { createContext, useContext } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { observer } from 'mobx-react'
import Translate from '@/utils/Translate'

import { useStores } from '@/stores/stores'
import Card from './card'
import { ExpandCollapse } from './ExpandCollapse'
import { SectionTitleAsterisk } from '.'

const SectionContext = createContext()

const Section = ({ sectionName, children }) => (
  <SectionContext.Provider value={sectionName}>
    <SectionComponent>{children}</SectionComponent>
  </SectionContext.Provider>
)

const SectionComponent = observer(({ children }) => {
  const sectionName = useSectionName()
  const {
    Qvain: {
      Sections: { [sectionName]: section },
    },
  } = useStores()
  const {
    translations: { title },
    isRequired,
    isExpanded,
    toggleExpanded,
    showAsterisk
  } = section

  return isRequired ? (
    <MandatorySection id={`section-${sectionName}`} title={title} showAsterisk={showAsterisk}>
      {children}
    </MandatorySection>
  ) : (
    <OptionalSection
      id={`section-${sectionName}`}
      title={title}
      isExpanded={isExpanded}
      toggleExpanded={toggleExpanded}
    >
      {children}
    </OptionalSection>
  )
})

SectionComponent.propTypes = {
  children: PropTypes.oneOfType([PropTypes.array, PropTypes.element]).isRequired,
}

const MandatorySection = ({ children, title, showAsterisk }) => (
  <Card>
    {showAsterisk ? (
      <CustomSectionTitle>
        <Translate content={title} />
        <SectionTitleAsterisk />
      </CustomSectionTitle>
    ) : (
      <SectionTitle>
        <Translate content={title} />
      </SectionTitle>
    )}

    <Content>{children}</Content>
  </Card>
)

const OptionalSection = ({ children, title, isExpanded, toggleExpanded }) => (
  <Card bottomContent={!isExpanded}>
    <SectionTitle>
      <ExpandCollapse type="button" isExpanded={isExpanded} onClick={toggleExpanded} />
      <Translate content={title} onClick={toggleExpanded} />
    </SectionTitle>
    {isExpanded && <Content>{children}</Content>}
  </Card>
)

Section.propTypes = {
  sectionName: PropTypes.string.isRequired,
  children: PropTypes.oneOfType([PropTypes.array, PropTypes.element]).isRequired,
}

MandatorySection.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.oneOfType([PropTypes.array, PropTypes.element]).isRequired,
  showAsterisk: PropTypes.bool.isRequired,
}

OptionalSection.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.oneOfType([PropTypes.array, PropTypes.element]).isRequired,
  isExpanded: PropTypes.bool.isRequired,
  toggleExpanded: PropTypes.func.isRequired,
}

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

const CustomSectionTitle = styled.h2`
  text-transform: uppercase;
  color: ${p => p.theme.color.primary};
  font-weight: bold;
  font-size: 20px;
  margin-bottom: 0;
`

const SectionTitle = styled.h2`
  display: flex;
  gap: 1rem;
  text-transform: uppercase;
  color: ${p => p.theme.color.primary};
  font-weight: bold;
  font-size: 20px;
  margin-bottom: 0;
`

export const SectionContentWrapper = styled.div`
  gap: 0px;
`

export default observer(Section)

export const useSectionName = () => useContext(SectionContext)

export const useField = fieldName => {
  const sectionName = useSectionName()
  const {
    Qvain: {
      Sections: {
        [sectionName]: { getField },
      },
    },
  } = useStores()
  return getField(fieldName)
}
