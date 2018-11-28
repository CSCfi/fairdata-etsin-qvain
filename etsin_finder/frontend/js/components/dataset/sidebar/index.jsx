import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { inject, observer } from 'mobx-react'

import checkDataLang from '../../../utils/checkDataLang'
import checkNested from '../../../utils/checkNested'
import dateFormat from '../../../utils/dateFormat'
import SidebarItem from './sidebarItem'
import Identifier from '../identifier'
import Citation from './special/citation'
import Logo from './special/logo'
import License from './special/license'
import ErrorBoundary from '../../general/errorBoundary'

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
      publisher: checkNested(researchDataset, 'publisher', 'name')
        ? researchDataset.publisher.name
        : false,
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
        <ListItem key={item.geographic_name}>
          {checkDataLang(item.place_uri.pref_label)} <span>({item.geographic_name})</span>
        </ListItem>
      )
    }
    if (item.geographic_name) {
      return <ListItem key={item.geographic_name}>{item.geographic_name}</ListItem>
    }
    return null
  }

  keywordsAndTheme() {
    const labels = []
    if (this.state.theme) {
      labels.push(...this.state.theme.map(theme => checkDataLang(theme.pref_label)))
    }
    if (this.state.keyword) labels.push(...this.state.keyword)
    return labels.join(', ')
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
                  alt={checkDataLang(this.state.catalogTitle)}
                  file={this.state.logo}
                  url={this.state.catalogPublisherHomepage}
                />
              </SidebarItem>
            )}

            {/* DATA CATALOG PUBLISHER */}

            <SidebarItem component="dd" trans="dataset.catalog_publisher">
              {this.state.catalog_publisher && checkDataLang(this.state.catalog_publisher)}
            </SidebarItem>
            <HorizontalLine aria-hidden />

            {/* PREFERRED IDENTIFIER */}

            <SidebarItem component="dd" trans="dataset.identifier">
              <Identifier idn={this.state.pid} />
            </SidebarItem>
            <HorizontalLine aria-hidden />
            {/* FIELD OF SCIENCE */}

            <SidebarItem
              trans="dataset.field_of_science"
              fallback="Field of Science"
              hideEmpty="true"
            >
              {this.state.field &&
                this.state.field.map(field => (
                  <ListItem key={field.identifier}>{checkDataLang(field.pref_label)}</ListItem>
                ))}
            </SidebarItem>

            {/* KEYWORDS */}

            <SidebarItem component="dd" trans="dataset.keywords" hideEmpty="true">
              {this.keywordsAndTheme()}
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
                    <ListItem key={`${language}-${i}`}>{language}</ListItem>
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
                this.state.geographic_name.map(single => this.spatial(single))}
            </SidebarItem>

            {/* TEMPORAL COVERAGE */}

            <SidebarItem
              trans="dataset.temporal_coverage"
              fallback="Temporal Coverage"
              hideEmpty="true"
            >
              {this.state.temporal &&
                this.state.temporal.map(dates =>
                  this.dateSeparator(dates.start_date, dates.end_date)
                )}
            </SidebarItem>

            {/* LICENSE */}
            <SidebarItem trans="dataset.license" hideEmpty="true">
              {this.state.license &&
                this.state.license.map(rights => (
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
                  ? this.state.access_rights.restriction_grounds.map(rg => (
                      <ListItem key={`rg-${rg.identifier}`}>
                        {checkDataLang(rg.pref_label)}
                      </ListItem>
                    ))
                  : checkNested(this.state.access_rights, 'access_type', 'pref_label') && (
                      <ListItem>
                        {checkDataLang(this.state.access_rights.access_type.pref_label)}
                      </ListItem>
                    )}
              </SidebarItem>
            )}

            {/* PROJECT NAME */}

            <SidebarItem trans="dataset.project" hideEmpty="true">
              {this.state.isOutputOf &&
                this.state.isOutputOf.map(item => {
                  const name = checkDataLang(item.name)
                  return <ListItem key={name}>{name}</ListItem>
                })}
            </SidebarItem>

            {/* PROJECT FUNDER NAME */}

            <SidebarItem trans="dataset.funder" hideEmpty="true">
              {this.state.isOutputOf &&
                this.state.isOutputOf.map(
                  output =>
                    checkNested(output, 'has_funding_agency') &&
                    output.has_funding_agency.map(agency => (
                      <ListItem key={checkDataLang(agency.name)}>
                        {checkDataLang(agency.name)}
                      </ListItem>
                    ))
                )}
            </SidebarItem>

            {/* PUBLISHER */}

            <SidebarItem component="dd" trans="dataset.publisher" hideEmpty="true">
              {this.state.publisher && checkDataLang(this.state.publisher)}
            </SidebarItem>

            {/* CURATOR */}

            <SidebarItem trans="dataset.curator" hideEmpty="true">
              {this.state.curator &&
                this.state.curator.map((curators, i) => {
                  let curator = checkDataLang(curators.name)
                  if (curator === '') {
                    curator = curators.name
                  }
                  return (
                    /* eslint-disable react/no-array-index-key */
                    <ListItem key={`${curator}-${i}`}>{curator}</ListItem>
                    /* eslint-enable react/no-array-index-key */
                  )
                })}
            </SidebarItem>

            {/* RIGHTS HOLDER */}

            <SidebarItem trans="dataset.rights_holder" hideEmpty="true">
              {this.state.rightsHolder &&
                this.state.rightsHolder.map((rightsHolders, i) => {
                  let rightsHolder = checkDataLang(rightsHolders.name)
                  if (rightsHolder === '') {
                    rightsHolder = rightsHolders.name
                  }
                  return (
                    /* eslint-disable react/no-array-index-key */
                    <ListItem key={`${rightsHolder}-${i}`}>{rightsHolder}</ListItem>
                    /* eslint-enable react/no-array-index-key */
                  )
                })}
            </SidebarItem>

            {/* INFRASTRUCTURE */}

            <SidebarItem trans="dataset.infrastructure" hideEmpty="true">
              {this.state.infrastructure &&
                this.state.infrastructure.map(entity => (
                  <ListItem key={entity.identifier}>{checkDataLang(entity.pref_label)}</ListItem>
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

const HorizontalLine = styled.hr`
  border-style: solid;
  border-color: ${props => props.theme.color.lightgray};
  margin: 20px 0;
`

const ListItem = styled.dd``

export default inject('Stores')(observer(Sidebar))
