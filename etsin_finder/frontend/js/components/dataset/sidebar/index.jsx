import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { observer } from 'mobx-react'
import Translate from 'react-translate-component'

import checkNested from '../../../utils/checkNested'
import SidebarItem from './sidebarItem'
import Identifier from '../identifier'
import Logo from './special/logo'
import License from './special/license'
import ErrorBoundary from '../../general/errorBoundary'
import Agent from '../Agent'
import Project from './special/project'
import DatasetIsCumulativeNotificationBar from '../../general/datasetIsCumulativeNotificationBar'
import { withStores } from '../../../stores/stores'
import CitationButton from '../citation/citationButton'
import { ACCESS_TYPE_URL } from '@/utils/constants'

class Sidebar extends Component {
  spatial(item) {
    const {
      Locale: { getPreferredLang, getValueTranslation },
    } = this.props.Stores

    if (
      item.geographic_name &&
      checkNested(item, 'place_uri', 'pref_label') &&
      item.geographic_name !== getValueTranslation(item.place_uri.pref_label)
    ) {
      return (
        <ListItem key={item.geographic_name} lang={getPreferredLang(item.place_uri.pref_label)}>
          {getValueTranslation(item.place_uri.pref_label)} <span>({item.geographic_name})</span>
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
    const {
      Locale: { getValueTranslation },
    } = this.props.Stores

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
            {getValueTranslation(theme.pref_label)}
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

  accessRights() {
    const {
      Locale: { getPreferredLang, getValueTranslation },
    } = this.props.Stores

    const researchDataset = this.props.dataset.research_dataset
    const accessRights = checkNested(researchDataset, 'access_rights')
      ? researchDataset.access_rights
      : false

    const isOpen = accessRights.access_type.identifier === ACCESS_TYPE_URL.OPEN
    if (!isOpen && accessRights.restriction_grounds?.length > 0) {
      return accessRights.restriction_grounds.map(rg => (
        <ListItem key={`rg-${rg.identifier}`} lang={getPreferredLang(rg.pref_label)}>
          {getValueTranslation(rg.pref_label)}
        </ListItem>
      ))
    }
    return (
      checkNested(accessRights, 'access_type', 'pref_label') && (
        <ListItem lang={getPreferredLang(accessRights.access_type.pref_label)}>
          {getValueTranslation(accessRights.access_type.pref_label)}
        </ListItem>
      )
    )
  }

  render() {
    const { Locale } = this.props.Stores
    const { getPreferredLang, getValueTranslation } = Locale
    const { setShowCitationModal } = this.props.Stores.DatasetQuery
    const dataCatalog = this.props.dataset.data_catalog
    const researchDataset = this.props.dataset.research_dataset

    // sidebar data
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
    const title = catalogTitle[getPreferredLang(catalogPublisher)]

    return (
      <SidebarContainer>
        <ErrorBoundary>
          <dl>
            {/* DATA CATALOG LOGO */}
            {logo && (
              <SidebarItem>
                <Translate
                  component={Logo}
                  attributes={{ alt: 'dataset.catalog_alt_text' }}
                  with={{ title }}
                  file={logo}
                  url={catalogPublisherHomepage}
                />
              </SidebarItem>
            )}

            {/* DATA CATALOG PUBLISHER */}

            <SidebarItem
              component="dd"
              trans="dataset.catalog_publisher"
              lang={getPreferredLang(catalogPublisher)}
              lineAfter
            >
              {catalogPublisher && getValueTranslation(catalogPublisher)}
            </SidebarItem>

            {/* PREFERRED IDENTIFIER */}

            <SidebarItem component="dd" trans="dataset.identifier" lineAfter>
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

            <SidebarItem trans="dataset.citation.titleShort" lineAfter>
              <CitationButton setShowCitationModal={setShowCitationModal} />
            </SidebarItem>

            {/* FIELD OF SCIENCE */}

            <SidebarItem trans="dataset.field_of_science" fallback="Field of Science">
              <List>
                {field &&
                  field.map(f => (
                    <ListItem key={f.identifier} lang={getPreferredLang(f.pref_label)}>
                      {getValueTranslation(f.pref_label)}
                    </ListItem>
                  ))}
              </List>
            </SidebarItem>

            {/* KEYWORDS */}

            <SidebarItem trans="dataset.keywords">{this.keywords()}</SidebarItem>

            {/* SUBJECT HEADING */}

            <SidebarItem trans="dataset.subjectHeading">{this.subjectHeading()}</SidebarItem>

            {/* LANGUAGE */}

            <SidebarItem trans="dataset.language">
              <List>
                {language &&
                  language.map((languages, i) => {
                    let lang = getValueTranslation(languages.title)
                    if (lang === '') {
                      lang = languages.title
                    }
                    return (
                      /* eslint-disable react/no-array-index-key */
                      <ListItem key={`${lang}-${i}`} lang={getPreferredLang(languages.title)}>
                        {lang}
                      </ListItem>
                      /* eslint-enable react/no-array-index-key */
                    )
                  })}
              </List>
            </SidebarItem>

            {/* SPATIAL COVERAGE */}

            <SidebarItem trans="dataset.spatial_coverage" fallback="Spatial Coverage">
              <List>{geographicName && geographicName.map(single => this.spatial(single))}</List>
            </SidebarItem>

            {/* TEMPORAL COVERAGE */}

            <SidebarItem trans="dataset.temporal_coverage" fallback="Temporal Coverage">
              {temporal &&
                temporal.map(dates => (
                  <TemporalCoverageItem key={`temporal-${dates.start_date}-${dates.end_date}`}>
                    {Locale.dateSeparator(dates.start_date, dates.end_date)}
                  </TemporalCoverageItem>
                ))}
            </SidebarItem>

            {/* LICENSE */}
            <SidebarItem trans="dataset.license">
              <List>
                {license &&
                  license.map(rights => (
                    <ListItem key={rights.identifier}>
                      <License data={rights} />
                    </ListItem>
                  ))}
              </List>
            </SidebarItem>

            {/* ACCESS RIGHTS RESTRICTION_GROUNDS */}

            {accessRights && (
              <SidebarItem trans="dataset.access_rights">
                <List>{this.accessRights()}</List>
              </SidebarItem>
            )}

            {/* PROJECTS */}

            <SidebarItem trans="dataset.project.project">
              <List>
                {isOutputOf &&
                  isOutputOf.map(item => {
                    const projectName = getValueTranslation(item.name)
                    return (
                      <ListItem key={`li-${projectName}`} lang={getPreferredLang(item.name)}>
                        <Project project={item} />
                      </ListItem>
                    )
                  })}
              </List>
            </SidebarItem>

            {/* PUBLISHER */}

            <SidebarItem trans="dataset.publisher">
              {publisher && (
                <List>
                  <Agent
                    lang={getPreferredLang(publisher.name)}
                    key={getValueTranslation(publisher) || publisher.name}
                    first
                    agent={publisher}
                    popupAlign="sidebar"
                  />
                </List>
              )}
            </SidebarItem>

            {/* CURATOR */}

            <SidebarItem trans="dataset.curator">
              <List>
                {curator &&
                  curator.map(actor => {
                    let curatorName = getValueTranslation(actor.name)
                    if (curatorName === '') {
                      curatorName = actor.name
                    }
                    return (
                      <Agent
                        key={`li-${curatorName}`}
                        lang={getPreferredLang(actor.name)}
                        first
                        agent={actor}
                        popupAlign="sidebar"
                      />
                    )
                  })}
              </List>
            </SidebarItem>

            {/* RIGHTS HOLDER */}

            <SidebarItem trans="dataset.rights_holder">
              {rightsHolder && (
                <List>
                  {rightsHolder.map(actor => {
                    let rightsHolderName = getValueTranslation(actor.name)
                    if (rightsHolderName === '') {
                      rightsHolderName = actor.name
                    }
                    return (
                      <Agent
                        key={`li-${rightsHolderName}`}
                        lang={getPreferredLang(actor.name)}
                        first
                        agent={actor}
                        popupAlign="sidebar"
                      />
                    )
                  })}
                </List>
              )}
            </SidebarItem>

            {/* INFRASTRUCTURE */}

            <SidebarItem trans="dataset.infrastructure">
              <List>
                {infrastructure &&
                  infrastructure.map(entity => (
                    <ListItem key={entity.identifier} lang={getPreferredLang(entity.pref_label)}>
                      {getValueTranslation(entity.pref_label)}
                    </ListItem>
                  ))}
              </List>
            </SidebarItem>
          </dl>
        </ErrorBoundary>
      </SidebarContainer>
    )
  }
}

Sidebar.propTypes = {
  dataset: PropTypes.object.isRequired,
  Stores: PropTypes.object.isRequired,
}

const SidebarContainer = styled.div`
  border: 2px solid rgb(231, 233, 237);
  word-wrap: break-word;
  word-break: break-word;
  -webkit-hyphens: auto;
  -moz-hyphens: auto;
  -ms-hyphens: auto;
  hyphens: auto;
  padding: 20px 0 0 0;
`

const TemporalCoverageItem = styled.div``

const SidebarContainerForCumulativeInfo = styled.div`
  padding: 0.5em 0em 0em 0em;
`

const SubjectHeaderLink = styled.a`
  display: block;
`

const List = styled.ul`
  list-style: none;
`

const ListItem = styled.li``

export default withStores(observer(Sidebar))
