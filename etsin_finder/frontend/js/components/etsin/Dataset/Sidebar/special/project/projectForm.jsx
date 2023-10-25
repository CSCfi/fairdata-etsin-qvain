import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Translate from 'react-translate-component'

import Agent from '../../../Agent'
import { useStores } from '@/stores/stores'

const ProjectForm = ({ project, lang }) => {
  const {
    Locale: { getPreferredLang, getValueTranslation },
  } = useStores()
  const hasFunderInfo = Boolean(
    project.has_funder_identifier || project.funder_type || project.has_funding_agency
  )

  return (
    <Form>
      <InputContainer>
        <List>
          <Key>
            <Translate content="dataset.project.name" />
          </Key>
          <Value>{getValueTranslation(project.name)}</Value>
          {project.identifier && (
            <div>
              <Key>
                <Translate content="dataset.project.identifier" />
              </Key>
              <Value>{project.identifier}</Value>
            </div>
          )}
        </List>
        {project.homepage?.identifier && (
          <div>
            <Topic>
              <Translate content="dataset.project.homepage" />
            </Topic>
            <List>
              <Key>
                <Translate content="dataset.project.homepageUrl" />
              </Key>
              <Value>
                <a
                  href={project.homepage.identifier}
                  target="_blank"
                  rel="noopener noreferrer"
                  lang={lang}
                  title={getValueTranslation(project.homepage.title) || project.homepage.identifier}
                >
                  {project.homepage.title ? (
                    <span lang={getPreferredLang(project.homepage.title)}>
                      {getValueTranslation(project.homepage.title)}
                    </span>
                  ) : (
                    project.homepage.identifier
                  )}
                </a>
              </Value>
              {project.homepage.description && (
                <div>
                  <Key>
                    <Translate content="dataset.project.homepageDescr" />
                  </Key>
                  <Value>{getValueTranslation(project.homepage.description)}</Value>
                </div>
              )}
            </List>
          </div>
        )}
        {project.source_organization && (
          <div>
            <Topic>
              <Translate content="dataset.project.sourceOrg" />
            </Topic>
            <OrgList>
              {project.source_organization.map(org => (
                <dd key={getValueTranslation(org.actor.organization.pref_label)}>
                  <Agent lang={lang} first agent={org.actor} popupAlign="left-fit-content" />
                </dd>
              ))}
            </OrgList>
          </div>
        )}
        {hasFunderInfo && (
          <div>
            <Topic>
              <Translate content="dataset.project.funding" />
            </Topic>
            <List>
              {project.has_funder_identifier && (
                <div>
                  <Key>
                    <Translate content="dataset.project.has_funder_identifier" />
                  </Key>
                  <Value>{project.has_funder_identifier}</Value>
                </div>
              )}
              {project.funder_type?.pref_label && (
                <div>
                  <Key>
                    <Translate content="dataset.project.funder_type" />
                  </Key>
                  <Value>{getValueTranslation(project.funder_type.pref_label)}</Value>
                </div>
              )}
              {project.has_funding_agency &&
                project.has_funding_agency.map(agency => (
                  <div key={getValueTranslation(agency.pref_label)}>
                    <Key>
                      <Translate content="dataset.project.funder" />
                    </Key>
                    <Value>
                      <Agent lang={lang} first agent={agency.actor} popupAlign="left-fit-content" />
                    </Value>
                  </div>
                ))}
            </List>
          </div>
        )}
      </InputContainer>
    </Form>
  )
}

ProjectForm.propTypes = {
  project: PropTypes.object.isRequired,
  lang: PropTypes.string.isRequired,
}

const InputContainer = styled.div`
  display: inline-flex;
  flex-direction: column;
  width: 100%;
  @media (min-width: ${props => props.theme.breakpoints.sm}) {
    width: ${props => (props.width ? props.width : '100%')};
    padding-right: ${props => (props.paddingRight ? props.paddingRight : '')};
    padding-left: ${props => (props.paddingLeft ? props.paddingLeft : '')};
  },
  padding-top: 10px;
  padding-bottom: 10px;
`

const Topic = styled.h3`
  padding-top: 10px;
`

const Form = styled.form`
  display: flex;
  flex-wrap: wrap;
  align-content: center;
  min-width: 260px;
`

const List = styled.dl`
  padding: 0.5em;
`

const Key = styled.dt`
  font-weight: bold;
  text-decoration: underline;
`

const Value = styled.dd`
  margin: 0;
  padding: 0 0 0.5em 0;
`

const OrgList = styled.div`
  margin: 0;
  padding-left: 0.5em;
`
export default ProjectForm
