import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Translate from '@/utils/Translate'

import { useStores } from '@/stores/stores'

import Agent from '../../../Agent'
import DatasetInfoItem from '../../../DatasetInfoItem'

const ProjectForm = ({ project, lang }) => {
  const {
    Locale: { getValueTranslation },
  } = useStores()

  const funding = project.funding?.reduce((orderedFunding, single) => {
    if (Object.entries(single).length === 0) return orderedFunding
    if (single.funding_identifier in orderedFunding) {
      orderedFunding[single.funding_identifier].push(single.funder)
    } else {
      orderedFunding[single.funding_identifier] = [single.funder]
    }
    return orderedFunding
  }, {})

  return (
    <Form>
      <InputContainer>
        <DatasetInfoItem id="project-title" itemTitle="dataset.project.name">
          {getValueTranslation(project.title)}
        </DatasetInfoItem>

        <DatasetInfoItem id="project-id" itemTitle="dataset.project.identifier">
          {project.project_identifier}
        </DatasetInfoItem>

        <DatasetInfoItem id="project-orgs" itemTitle="dataset.project.sourceOrg">
          {project.participating_organizations && (
            <>
              <OrgList>
                {project.participating_organizations.map(org => (
                  <Agent
                    key={getValueTranslation(org.pref_label)}
                    lang={lang}
                    first
                    agent={{ organization: org }}
                    popupAlign="left-fit-content"
                  />
                ))}
              </OrgList>
            </>
          )}
        </DatasetInfoItem>

        {Object.entries(funding || {}).length > 0 && (
          <>
            <Topic>
              <Translate content="dataset.project.funding" />
            </Topic>
            {Object.entries(funding).map(([id, orgs]) => (
              <Funding key={`${id}`}>
                <DatasetInfoItem
                  key={`funding-${id}`}
                  id={`funding-${id}`}
                  itemTitle="dataset.project.has_funder_identifier"
                >
                  {id !== 'undefined' && id}
                </DatasetInfoItem>

                <DatasetInfoItem
                  id={`funding-funders-${id}`}
                  key={`funding-funders-${id}`}
                  itemTitle={
                    orgs?.length > 1 ? 'dataset.project.funder_plural' : 'dataset.project.funder'
                  }
                >
                  {orgs?.map(org => {
                    if (!org) return null
                    return (
                      <div
                        key={`${id}-${getValueTranslation(
                          org.funder_type?.pref_label
                        )}-${getValueTranslation(org.organization?.pref_label)}`}
                      >
                        {org.funder_type && (
                          <div>
                            {<Translate content="dataset.project.funder_type" />}
                            {`: ${getValueTranslation(org.funder_type?.pref_label)}`}
                          </div>
                        )}

                        {org.organization && (
                          <>
                            <Agent
                              key={getValueTranslation(org.organization.pref_label)}
                              lang={lang}
                              first
                              agent={{ organization: org.organization }}
                              popupAlign="left-fit-content"
                            />
                          </>
                        )}
                      </div>
                    )
                  })}
                </DatasetInfoItem>
              </Funding>
            ))}
          </>
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

const Topic = styled.h2`
  padding-top: 2rem;
`

const Form = styled.form`
  display: flex;
  flex-wrap: wrap;
  align-content: center;
  min-width: 260px;
`

const OrgList = styled.div`
  margin: 0;
  padding-left: 0;
`

const Funding = styled.div`
  :not(:last-child) {
    padding-bottom: 1rem;
    border-bottom: 2px solid ${props => props.theme.color.lightgray};
  }
`

export default ProjectForm
