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

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Translate from 'react-translate-component'
import checkNested from '../../../../../utils/checkNested'
import Agent from '../../../Agent'
import { withStores } from '@/stores/stores'

class ProjectForm extends Component {
  constructor(props) {
    super(props)

    const project = props.project
    const lang = props.lang

    this.state = {
      project,
      lang,
    }
  }

  hasFunderInfo() {
    return (
      this.state.project.has_funder_identifier ||
      checkNested(this.state.project, 'funder_type') ||
      checkNested(this.state.project, 'has_funding_agency')
    )
  }

  render() {
    const {
      Locale: { getValueTranslation },
    } = this.props.Stores

    return (
      <Form>
        <InputContainer>
          <List>
            <Key>
              <Translate content="dataset.project.name" />
            </Key>
            <Value>{getValueTranslation(this.state.project.name)}</Value>
            {this.state.project.identifier && (
              <div>
                <Key>
                  <Translate content="dataset.project.identifier" />
                </Key>
                <Value>{this.state.project.identifier}</Value>
              </div>
            )}
          </List>
          {checkNested(this.state.project, 'homepage', 'identifier') && (
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
                    href={this.state.project.homepage.identifier}
                    target="_blank"
                    rel="noopener noreferrer"
                    lang={this.state.lang}
                    title={
                      getValueTranslation(this.state.project.homepage.title) ||
                      this.state.project.homepage.identifier
                    }
                  >
                    {this.state.project.homepage.title ? (
                      <span lang={this.state.project.homepage.title}>
                        {getValueTranslation(this.state.project.homepage.title)}
                      </span>
                    ) : (
                      this.state.project.homepage.identifier
                    )}
                  </a>
                </Value>
                {this.state.project.homepage.description && (
                  <div>
                    <Key>
                      <Translate content="dataset.project.homepageDescr" />
                    </Key>
                    <Value>{getValueTranslation(this.state.project.homepage.description)}</Value>
                  </div>
                )}
              </List>
            </div>
          )}
          {checkNested(this.state.project, 'source_organization') && (
            <div>
              <Topic>
                <Translate content="dataset.project.sourceOrg" />
              </Topic>
              <OrgList>
                {this.state.project.source_organization.map(org => (
                  <dd key={getValueTranslation(org.name)}>
                    <Agent lang={this.state.lang} first agent={org} popupAlign="left-fit-content" />
                  </dd>
                ))}
              </OrgList>
            </div>
          )}
          {this.hasFunderInfo() && (
            <div>
              <Topic>
                <Translate content="dataset.project.funding" />
              </Topic>
              <List>
                {this.state.project.has_funder_identifier && (
                  <div>
                    <Key>
                      <Translate content="dataset.project.has_funder_identifier" />
                    </Key>
                    <Value>{this.state.project.has_funder_identifier}</Value>
                  </div>
                )}
                {checkNested(this.state.project, 'funder_type', 'pref_label') && (
                  <div>
                    <Key>
                      <Translate content="dataset.project.funder_type" />
                    </Key>
                    <Value>{getValueTranslation(this.state.project.funder_type.pref_label)}</Value>
                  </div>
                )}
                {checkNested(this.state.project, 'has_funding_agency') &&
                  this.state.project.has_funding_agency.map(agency => (
                    <div key={getValueTranslation(agency.name)}>
                      <Key>
                        <Translate content="dataset.project.funder" />
                      </Key>
                      <Value>
                        <Agent
                          lang={this.state.lang}
                          first
                          agent={agency}
                          popupAlign="left-fit-content"
                        />
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
}

ProjectForm.propTypes = {
  project: PropTypes.object.isRequired,
  lang: PropTypes.string.isRequired,
  Stores: PropTypes.object.isRequired,
}

/* Styles */

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

export default withStores(ProjectForm)
