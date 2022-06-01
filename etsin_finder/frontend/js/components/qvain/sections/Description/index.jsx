import React from 'react'
import Section from '@/components/qvain/general/V2/Section'
import TitleAndDescription from './TitleAndDescription'
import IssuedDate from './IssuedDate'
import Keywords from './Keywords'
import FieldOfScience from './FieldOfScience'
import Language from './Language'
import OtherIdentifier from './OtherIdentifier'
import SubjectHeadings from './SubjectHeadings'

const Description = () => (
  <Section sectionName="Description">
    <TitleAndDescription />
    <IssuedDate />
    <Keywords />
    <SubjectHeadings />
    <FieldOfScience />
    <Language />
    <OtherIdentifier />
  </Section>
)

export default Description
