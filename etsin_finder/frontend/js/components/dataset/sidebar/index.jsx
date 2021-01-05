import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { observer } from 'mobx-react'
import Translate from 'react-translate-component'
import translate from 'counterpart'

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
import { withStores } from '../../../stores/stores'

class Sidebar extends Component {
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
    const researchDataset = this.props.dataset.research_dataset
    const labels = []
    if (researchDataset.keyword) {
      labels.push(...researchDataset.keyword)
    }
    return labels.join(', ')
  }

  subjectHeading() {
    const researchDataset = this.props.dataset.research_dataset
    const labels = []
    if (researchDataset.theme) {
      labels.push(
        ...researchDataset.theme.map(theme => (
          <SubjectHeaderLink
            key={theme.identifier}
            href={theme.identifier}
            target="_blank"
            rel="noopener noreferrer"
            title={theme.identifier}
          >
            {checkDataLang(theme.pref_label)}
          </SubjectHeaderLink>
        ))
      )
    }
    return labels
  }

  identifier() {
    const researchDataset = this.props.dataset.research_dataset
    const isDraft = this.props.dataset.state === 'draft'
    const draftOf = this.props.dataset.draft_of
    if (isDraft && !draftOf) {
      return <Translate content="dataset.draftIdentifierInfo" />
    }

    if (draftOf) {
      return <Identifier idn={draftOf.preferred_identifier} />
    }

    const pid = researchDataset.preferred_identifier
    return <Identifier idn={pid} />
  }

  render() {
    const dataCatalog = this.props.dataset.data_catalog
    const researchDataset = this.props.dataset.research_dataset

    // sidebar data
    const harvested = dataCatalog.catalog_json.harvested
    const catalogPublisher = checkNested(dataCatalog, 'catalog_json', 'publisher', 'name')
      ? dataCatalog.catalog_json.publisher.name
      : false
    const publisher = researchDataset.publisher
    const catalogTitle = dataCatalog.catalog_json.title
    const catalogPublisherHomepage = checkNested(
      dataCatalog,
      'catalog_json',
      'publisher',
      'homepage'
    )
      ? dataCatalog.catalog_json.publisher.homepage[0].identifier
      : ''
    const logo = dataCatalog.catalog_json.logo
    const field = researchDataset.field_of_science
    const geographicName = checkNested(researchDataset, 'spatial') ? researchDataset.spatial : false
    const temporal = checkNested(researchDataset, 'temporal') ? researchDataset.temporal : false
    const license = checkNested(researchDataset, 'access_rights', 'license')
      ? researchDataset.access_rights.license
      : false
    const accessRights = checkNested(researchDataset, 'access_rights')
      ? researchDataset.access_rights
      : false
    const isOutputOf = checkNested(researchDataset, 'is_output_of')
      ? researchDataset.is_output_of
      : false
    const curator = researchDataset.curator
    const rightsHolder = researchDataset.rights_holder
    const language = researchDataset.language
    const infrastructure = checkNested(researchDataset, 'infrastructure')
      ? researchDataset.infrastructure
      : false
    const title = catalogTitle[getDataLang(catalogPublisher)]

    return (
      <SidebarContainer>
        <ErrorBoundary>
          <dl>
            {/* DATA CATALOG LOGO */}
            {logo && (
              <SidebarItem>
                <Logo
                  lang={getDataLang(catalogTitle)}
                  alt={translate('dataset.catalog_alt_text', { title })}
                  file={logo}
                  url={catalogPublisherHomepage}
                />
              </SidebarItem>
            )}

            {/* DATA CATALOG PUBLISHER */}

            <SidebarItem
              component="dd"
              trans="dataset.catalog_publisher"
              lang={getDataLang(catalogPublisher)}
            >
              {catalogPublisher && checkDataLang(catalogPublisher)}
            </SidebarItem>
            <HorizontalLine aria-hidden />

            {/* PREFERRED IDENTIFIER */}

            <SidebarItem component="dd" trans="dataset.identifier">
              {this.identifier()}

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
              {field &&
                field.map(f => (
                  <ListItem key={f.identifier} lang={getDataLang(f.pref_label)}>
                    {checkDataLang(f.pref_label)}
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
              {language &&
                language.map((languages, i) => {
                  let lang = checkDataLang(languages.title)
                  if (lang === '') {
                    lang = languages.title
                  }
                  return (
                    /* eslint-disable react/no-array-index-key */
                    <ListItem key={`${lang}-${i}`} lang={getDataLang(languages.title)}>
                      {lang}
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
              {geographicName && geographicName.map(single => this.spatial(single))}
            </SidebarItem>

            {/* TEMPORAL COVERAGE */}

            <SidebarItem
              trans="dataset.temporal_coverage"
              fallback="Temporal Coverage"
              hideEmpty="true"
            >
              {temporal &&
                temporal.map(dates => this.dateSeparator(dates.start_date, dates.end_date))}
            </SidebarItem>

            {/* LICENSE */}
            <SidebarItem trans="dataset.license" hideEmpty="true">
              {license &&
                license.map(rights => (
                  <ListItem key={rights.identifier}>
                    <License data={rights} />
                  </ListItem>
                ))}
            </SidebarItem>

            {/* ACCESS RIGHTS RESTRICTION_GROUNDS */}

            {accessRights && (
              <SidebarItem trans="dataset.access_rights" hideEmpty="true">
                {accessRights.restriction_grounds && accessRights.restriction_grounds.length > 0
                  ? accessRights.restriction_grounds.map(rg => (
                    <ListItem key={`rg-${rg.identifier}`} lang={getDataLang(rg.pref_label)}>
                      {checkDataLang(rg.pref_label)}
                    </ListItem>
                  ))
                  : checkNested(accessRights, 'access_type', 'pref_label') && (
                    <ListItem lang={getDataLang(accessRights.access_type.pref_label)}>
                      {checkDataLang(accessRights.access_type.pref_label)}
                    </ListItem>
                  )}
              </SidebarItem>
            )}

            {/* PROJECTS */}

            <SidebarItem trans="dataset.project.project" hideEmpty="true">
              {isOutputOf &&
                isOutputOf.map(item => {
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
              component="dd"
              trans="dataset.publisher"
              hideEmpty="true"
              lang={publisher && getDataLang(publisher)}
            >
              {publisher && (
                <Agent
                  lang={getDataLang(publisher)}
                  key={checkDataLang(publisher) || publisher.name}
                  first
                  agent={publisher}
                  popupAlign="sidebar"
                />
              )}
            </SidebarItem>

            {/* CURATOR */}

            <SidebarItem trans="dataset.curator" hideEmpty="true">
              {curator &&
                curator.map(actor => {
                  let curatorName = checkDataLang(actor.name)
                  if (curatorName === '') {
                    curatorName = actor.name
                  }
                  return (
                    <ListItem key={`li-${curatorName}`} lang={getDataLang(actor)}>
                      <Agent
                        lang={getDataLang(actor)}
                        key={curatorName}
                        first
                        agent={actor}
                        popupAlign="sidebar"
                      />
                    </ListItem>
                  )
                })}
            </SidebarItem>

            {/* RIGHTS HOLDER */}

            <SidebarItem trans="dataset.rights_holder" hideEmpty="true">
              {rightsHolder &&
                rightsHolder.map(actor => {
                  let rightsHolderName = checkDataLang(actor.name)
                  if (rightsHolderName === '') {
                    rightsHolderName = actor.name
                  }
                  return (
                    <ListItem key={`li-${rightsHolderName}`} lang={getDataLang(actor)}>
                      <Agent
                        lang={getDataLang(actor)}
                        key={rightsHolderName}
                        first
                        agent={actor}
                        popupAlign="sidebar"
                      />
                    </ListItem>
                  )
                })}
            </SidebarItem>

            {/* INFRASTRUCTURE */}

            <SidebarItem trans="dataset.infrastructure" hideEmpty="true">
              {infrastructure &&
                infrastructure.map(entity => (
                  <ListItem key={entity.identifier} lang={getDataLang(entity.pref_label)}>
                    {checkDataLang(entity.pref_label)}
                  </ListItem>
                ))}
            </SidebarItem>

            {/* CITATION */}

            <SidebarItem component="dd" trans="dataset.citation" hideEmpty="false">
              {!harvested && <Citation />}
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
  border-color: ${props => props.theme.color.lightgray};
  margin: 20px 0;
`

const SubjectHeaderLink = styled.a`
  display: block;
`

const ListItem = styled.dd``

export default withStores(observer(Sidebar))
