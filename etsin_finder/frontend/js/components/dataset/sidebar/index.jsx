import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { inject, observer } from 'mobx-react'

import checkDataLang, { getDataLang } from '../../../utils/checkDataLang'
import checkNested from '../../../utils/checkNested'
import dateFormat from '../../../utils/dateFormat'
import SidebarItem from './sidebarItem'
import Identifier from '../identifier'
import Citation from './special/citation'
import Logo from './special/logo'
import License from './special/license'
import ErrorBoundary from '../../general/errorBoundary'
import Agent from '../agent'
import Project from './special/project'
import DatasetIsCumulativeNotificationBar from '../../general/datasetIsCumulativeNotificationBar'

class Sidebar extends Component {
  constructor(props) {
    super(props)
    const dataCatalog = props.dataset.data_catalog
    const researchDataset = props.dataset.research_dataset

    // sidebar data
    this.state = {
      harvested: dataCatalog.catalog_json.harvested,
      catalog_publisher: checkNested(dataCatalog, 'catalog_json', 'publisher', 'name')
        ? dataCatalog.catalog_json.publisher.name
        : false,
      publisher: researchDataset.publisher,
      catalogTitle: dataCatalog.catalog_json.title,
      catalogPublisherHomepage: checkNested(dataCatalog, 'catalog_json', 'publisher', 'homepage')
        ? dataCatalog.catalog_json.publisher.homepage[0].identifier
        : '',
      logo: dataCatalog.catalog_json.logo,
      pid: researchDataset.preferred_identifier,
      field: researchDataset.field_of_science,
      keyword: researchDataset.keyword,
      theme: researchDataset.theme,
      geographic_name: checkNested(researchDataset, 'spatial') ? researchDataset.spatial : false,
      temporal: checkNested(researchDataset, 'temporal') ? researchDataset.temporal : false,
      license: checkNested(researchDataset, 'access_rights', 'license')
        ? researchDataset.access_rights.license
        : false,
      access_rights: checkNested(researchDataset, 'access_rights')
        ? researchDataset.access_rights
        : false,
      isOutputOf: checkNested(researchDataset, 'is_output_of')
        ? researchDataset.is_output_of
        : false,
      curator: researchDataset.curator,
      rightsHolder: researchDataset.rights_holder,
      language: researchDataset.language,
      infrastructure: checkNested(researchDataset, 'infrastructure')
        ? researchDataset.infrastructure
        : false,
    }
  }

  dateSeparator(start, end) {
    return (
      (start || end) && (
        <ListItem key={start}>
          {start === end ? dateFormat(start) : `${dateFormat(start)} - ${dateFormat(end)}`}
        </ListItem>
      )
    )
  }

  spatial(item) {
    if (
      item.geographic_name &&
      checkNested(item, 'place_uri', 'pref_label') &&
      item.geographic_name !== checkDataLang(item.place_uri.pref_label)
    ) {
      return (
        <ListItem key={item.geographic_name} lang={getDataLang(item.place_uri.pref_label)}>
          {checkDataLang(item.place_uri.pref_label)} <span>({item.geographic_name})</span>
        </ListItem>
      )
    }
    if (item.geographic_name) {
      return <ListItem key={item.geographic_name}>{item.geographic_name}</ListItem>
    }
    return null
  }

  keywords() {
    const labels = []
    if (this.state.keyword) labels.push(...this.state.keyword)
    return labels.join(', ')
  }

  subjectHeading() {
    const labels = []
    if (this.state.theme) {
    labels.push(...this.state.theme.map((theme) => (
      <SubjectHeaderLink
        href={theme.identifier}
        target="_blank"
        rel="noopener noreferrer"
        title={theme.identifier}
      >
        {checkDataLang(theme.pref_label)}
      </SubjectHeaderLink>
      )))
    }
    return labels
  }

  render() {
    return (
      <SidebarContainer>
        <ErrorBoundary>
          <dl>
            {/* DATA CATALOG LOGO */}
            {this.state.logo && (
              <SidebarItem>
                <Logo
                  lang={getDataLang(this.state.catalogTitle)}
                  alt={checkDataLang(this.state.catalogTitle)}
                  file={this.state.logo}
                  url={this.state.catalogPublisherHomepage}
                />
              </SidebarItem>
            )}

            {/* DATA CATALOG PUBLISHER */}

            <SidebarItem
              component="dd"
              trans="dataset.catalog_publisher"
              lang={getDataLang(this.state.catalog_publisher)}
            >
              {this.state.catalog_publisher && checkDataLang(this.state.catalog_publisher)}
            </SidebarItem>
            <HorizontalLine aria-hidden />

            {/* PREFERRED IDENTIFIER */}

            <SidebarItem component="dd" trans="dataset.identifier">
              <Identifier idn={this.state.pid} />

              {
                /* INFORMATION DISPLAYED FOR CUMULATIVE DATASETS */
                this.props.dataset.cumulative_state === 1 && (
                  <SidebarContainerForCumulativeInfo>
                    <DatasetIsCumulativeNotificationBar directionToDisplayTooltip="Left" />
                  </SidebarContainerForCumulativeInfo>
                )
              }
            </SidebarItem>
            <HorizontalLine aria-hidden />
            {/* FIELD OF SCIENCE */}

            <SidebarItem
              trans="dataset.field_of_science"
              fallback="Field of Science"
              hideEmpty="true"
            >
              {this.state.field &&
                this.state.field.map((field) => (
                  <ListItem key={field.identifier} lang={getDataLang(field.pref_label)}>
                    {checkDataLang(field.pref_label)}
                  </ListItem>
                ))}
            </SidebarItem>

            {/* KEYWORDS */}

            <SidebarItem component="dd" trans="dataset.keywords" hideEmpty="true">
              {this.keywords()}
            </SidebarItem>

            {/* SUBJECT HEADING */}

            <SidebarItem component="dd" trans="dataset.subjectHeading" hideEmpty="true">
              {this.subjectHeading()}
            </SidebarItem>

            {/* LANGUAGE */}

            <SidebarItem trans="dataset.language" hideEmpty="true">
              {this.state.language &&
                this.state.language.map((languages, i) => {
                  let language = checkDataLang(languages.title)
                  if (language === '') {
                    language = languages.title
                  }
                  return (
                    /* eslint-disable react/no-array-index-key */
                    <ListItem key={`${language}-${i}`} lang={getDataLang(languages.title)}>
                      {language}
                    </ListItem>
                    /* eslint-enable react/no-array-index-key */
                  )
                })}
            </SidebarItem>

            {/* SPATIAL COVERAGE */}

            <SidebarItem
              trans="dataset.spatial_coverage"
              fallback="Spatial Coverage"
              hideEmpty="true"
            >
              {this.state.geographic_name &&
                this.state.geographic_name.map((single) => this.spatial(single))}
            </SidebarItem>

            {/* TEMPORAL COVERAGE */}

            <SidebarItem
              trans="dataset.temporal_coverage"
              fallback="Temporal Coverage"
              hideEmpty="true"
            >
              {this.state.temporal &&
                this.state.temporal.map((dates) =>
                  this.dateSeparator(dates.start_date, dates.end_date)
                )}
            </SidebarItem>

            {/* LICENSE */}
            <SidebarItem trans="dataset.license" hideEmpty="true">
              {this.state.license &&
                this.state.license.map((rights) => (
                  <ListItem key={rights.identifier}>
                    <License data={rights} />
                  </ListItem>
                ))}
            </SidebarItem>

            {/* ACCESS RIGHTS RESTRICTION_GROUNDS */}

            {this.state.access_rights && (
              <SidebarItem trans="dataset.access_rights" hideEmpty="true">
                {this.state.access_rights.restriction_grounds &&
                  this.state.access_rights.restriction_grounds.length > 0
                  ? this.state.access_rights.restriction_grounds.map((rg) => (
                    <ListItem key={`rg-${rg.identifier}`} lang={getDataLang(rg.pref_label)}>
                      {checkDataLang(rg.pref_label)}
                    </ListItem>
                  ))
                  : checkNested(this.state.access_rights, 'access_type', 'pref_label') && (
                    <ListItem lang={getDataLang(this.state.access_rights.access_type.pref_label)}>
                      {checkDataLang(this.state.access_rights.access_type.pref_label)}
                    </ListItem>
                  )}
              </SidebarItem>
            )}

            {/* PROJECTS */}

            <SidebarItem trans="dataset.project.project" hideEmpty="true">
              {this.state.isOutputOf &&
                this.state.isOutputOf.map((item) => {
                  const projectName = checkDataLang(item.name)
                  return (
                    <ListItem key={`li-${projectName}`} lang={getDataLang(item.name)}>
                      <Project project={item} />
                    </ListItem>
                  )
                })}
            </SidebarItem>

            {/* PUBLISHER */}

            <SidebarItem
              componen="dd"
              trans="dataset.publisher"
              hideEmpty="true"
              lang={this.state.publisher && getDataLang(this.state.publisher)}
            >
              {this.state.publisher && (
                <Agent
                  lang={getDataLang(this.state.publisher)}
                  key={checkDataLang(this.state.publisher) || this.state.publisher.name}
                  first
                  agent={this.state.publisher}
                  popupAlign="sidebar"
                />
              )}
            </SidebarItem>

            {/* CURATOR */}

            <SidebarItem trans="dataset.curator" hideEmpty="true">
              {this.state.curator &&
                this.state.curator.map((curator) => {
                  let curatorName = checkDataLang(curator.name)
                  if (curatorName === '') {
                    curatorName = curator.name
                  }
                  return (
                    <ListItem key={`li-${curatorName}`} lang={getDataLang(curator)}>
                      <Agent
                        lang={getDataLang(curator)}
                        key={curatorName}
                        first
                        agent={curator}
                        popupAlign="sidebar"
                      />
                    </ListItem>
                  )
                })}
            </SidebarItem>

            {/* RIGHTS HOLDER */}

            <SidebarItem trans="dataset.rights_holder" hideEmpty="true">
              {this.state.rightsHolder &&
                this.state.rightsHolder.map((rightsHolder) => {
                  let rightsHolderName = checkDataLang(rightsHolder.name)
                  if (rightsHolderName === '') {
                    rightsHolderName = rightsHolder.name
                  }
                  return (
                    <ListItem key={`li-${rightsHolderName}`} lang={getDataLang(rightsHolder)}>
                      <Agent
                        lang={getDataLang(rightsHolder)}
                        key={rightsHolderName}
                        first
                        agent={rightsHolder}
                        popupAlign="sidebar"
                      />
                    </ListItem>
                  )
                })}
            </SidebarItem>

            {/* INFRASTRUCTURE */}

            <SidebarItem trans="dataset.infrastructure" hideEmpty="true">
              {this.state.infrastructure &&
                this.state.infrastructure.map((entity) => (
                  <ListItem key={entity.identifier} lang={getDataLang(entity.pref_label)}>
                    {checkDataLang(entity.pref_label)}
                  </ListItem>
                ))}
            </SidebarItem>

            {/* CITATION */}

            <SidebarItem component="dd" trans="dataset.citation" hideEmpty="false">
              {!this.state.harvested && <Citation />}
            </SidebarItem>
          </dl>
        </ErrorBoundary>
      </SidebarContainer>
    )
  }
}

Sidebar.propTypes = {
  dataset: PropTypes.object.isRequired,
}

const SidebarContainer = styled.aside`
  border: 2px solid rgb(231, 233, 237);
  word-wrap: break-word;
  word-break: break-word;
  -webkit-hyphens: auto;
  -moz-hyphens: auto;
  -ms-hyphens: auto;
  hyphens: auto;
  padding: 20px 0;
`

const SidebarContainerForCumulativeInfo = styled.div`
  padding: 0.5em 0em 0em 0em;
`

const HorizontalLine = styled.hr`
  border-style: solid;
  border-color: ${(props) => props.theme.color.lightgray};
  margin: 20px 0;
`

const SubjectHeaderLink = styled.a`
  display: block;
`

const ListItem = styled.dd``

export default inject('Stores')(observer(Sidebar))
