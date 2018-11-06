import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { inject, observer } from 'mobx-react'

import checkDataLang from '../../../utils/checkDataLang'
import checkNested from '../../../utils/checkNested'
import dateFormat from '../../../utils/dateFormat'
import SidebarItem from './sidebarItem'
import Identifier from '../identifier'
import Citation from './citation'
import Logo from './logo'
import ErrorBoundary from '../../general/errorBoundary'
import License from './license'

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
      logoAlt: dataCatalog.catalog_json.title,
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
        <div key={start}>
          {start === end ? dateFormat(start) : `${dateFormat(start)} - ${dateFormat(end)}`}
        </div>
      )
    )
  }

  spatial(item) {
    if (item.geographic_name && checkNested(item, 'place_uri', 'pref_label') && item.geographic_name !== checkDataLang(item.place_uri.pref_label)) {
      return (
        <div key={item.geographic_name}>
          {checkDataLang(item.place_uri.pref_label)} <span>({item.geographic_name})</span>
        </div>
      )
    }
    if (item.geographic_name) {
      return <div key={item.geographic_name}>{item.geographic_name}</div>
    }
    return null
  }

  render() {
    return (
      <SidebarContainer>
        <ErrorBoundary>
          <div className="separator">
            {this.state.logo && (
              <SidebarItem>
                <Logo alt={checkDataLang(this.state.logoAlt)} file={this.state.logo} />
              </SidebarItem>
            )}
            <SidebarItem component="div" trans="dataset.catalog_publisher">
              {this.state.catalog_publisher && checkDataLang(this.state.catalog_publisher)}
            </SidebarItem>
          </div>
          <div className="separator">
            <SidebarItem component="div" trans="dataset.identifier">
              <Identifier idn={this.state.pid} />
            </SidebarItem>
          </div>
          <div>

            {/* FIELD OF SCIENCE */}

            <SidebarItem
              component="div"
              trans="dataset.field_of_science"
              fallback="Field of Science"
              hideEmpty="true"
            >
              {this.state.field &&
                this.state.field.map(field => (
                  <Item key={field.identifier}>{checkDataLang(field.pref_label)}</Item>
                ))}
            </SidebarItem>

            {/* KEYWORDS */}

            <SidebarItem component="div" trans="dataset.keywords" hideEmpty="true">
              {this.state.theme &&
                this.state.theme.map(theme => (
                  <Item key={`theme-${theme.identifier}`}>{checkDataLang(theme.pref_label)}</Item>
                ))}
              {this.state.keyword &&
                this.state.keyword.map((keyword, i) => (
                  /* eslint-disable-next-line react/no-array-index-key */
                  <Item key={`keyword-${keyword}-${i}`}>{keyword}</Item>
                ))}
            </SidebarItem>

            {/* LANGUAGE */}

            <SidebarItem component="div" trans="dataset.language" hideEmpty="true">
              {this.state.language &&
                this.state.language.map((languages, i) => {
                  let language = checkDataLang(languages.title)
                  if (language === '') {
                    language = languages.title
                  }
                  return (
                    /* eslint-disable react/no-array-index-key */
                    <Item key={`${language}-${i}`}>{language}</Item>
                    /* eslint-enable react/no-array-index-key */
                  )
                })}
            </SidebarItem>

            {/* SPATIAL COVERAGE */}

            <SidebarItem
              component="div"
              trans="dataset.spatial_coverage"
              fallback="Spatial Coverage"
              hideEmpty="true"
            >
              {this.state.geographic_name &&
                this.state.geographic_name.map(single => this.spatial(single))}
            </SidebarItem>

            {/* TEMPORAL COVERAGE */}

            <SidebarItem
              component="div"
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

            <SidebarItem component="div" trans="dataset.license" hideEmpty="true">
              {this.state.license &&
                this.state.license.map(rights => <div><License key={rights.identifier} data={rights} /></div>)}
            </SidebarItem>

            {/* ACCESS_TYPE */}

            {this.state.access_rights && (
              <SidebarItem component="div" trans="dataset.access_rights" hideEmpty="true">
                {this.state.access_rights.restriction_grounds && this.state.access_rights.restriction_grounds.length > 0
                  ? this.state.access_rights.restriction_grounds.map(rg => (
                    <Item key={`rg-${rg.identifier}`}>{checkDataLang(rg.pref_label)}</Item>
                    ))
                  : checkNested(this.state.access_rights, 'access_type', 'pref_label') &&
                    checkDataLang(this.state.access_rights.access_type.pref_label)}
              </SidebarItem>
            )}

            {/* PROJECT NAME */}

            <SidebarItem component="div" trans="dataset.project" hideEmpty="true">
              {this.state.isOutputOf &&
                this.state.isOutputOf.map(item => {
                  const name = checkDataLang(item.name)
                  return <div key={name}>{name}</div>
                })}
            </SidebarItem>

            {/* PROJECT FUNDER NAME */}

            <SidebarItem component="div" trans="dataset.funder" hideEmpty="true">
              {this.state.isOutputOf &&
                this.state.isOutputOf.map(
                  output =>
                    checkNested(output, 'has_funding_agency') &&
                    output.has_funding_agency.map(agency => (
                      <div key={checkDataLang(agency.name)}>{checkDataLang(agency.name)}</div>
                    ))
                )}
            </SidebarItem>

            {/* PUBLISHER */}

            <SidebarItem component="div" trans="dataset.publisher" hideEmpty="true">
              {this.state.publisher && checkDataLang(this.state.publisher)}
            </SidebarItem>

            {/* CURATOR */}

            <SidebarItem component="div" trans="dataset.curator" hideEmpty="true">
              {this.state.curator &&
                this.state.curator.map((curators, i) => {
                  let curator = checkDataLang(curators.name)
                  if (curator === '') {
                    curator = curators.name
                  }
                  return (
                    /* eslint-disable react/no-array-index-key */
                    <div key={`${curator}-${i}`}>{curator}</div>
                    /* eslint-enable react/no-array-index-key */
                  )
                })}
            </SidebarItem>

            {/* RIGHTS HOLDER */}

            <SidebarItem component="div" trans="dataset.rights_holder" hideEmpty="true">
              {this.state.rightsHolder &&
                this.state.rightsHolder.map((rightsHolders, i) => {
                  let rightsHolder = checkDataLang(rightsHolders.name)
                  if (rightsHolder === '') {
                    rightsHolder = rightsHolders.name
                  }
                  return (
                    /* eslint-disable react/no-array-index-key */
                    <div key={`${rightsHolder}-${i}`}>{rightsHolder}</div>
                    /* eslint-enable react/no-array-index-key */
                  )
                })}
            </SidebarItem>

            {/* INFRASTRUCTURE */}

            <SidebarItem component="div" trans="dataset.infrastructure" hideEmpty="true">
              {this.state.infrastructure &&
                this.state.infrastructure.map(entity => (
                  <div key={entity.identifier}>{checkDataLang(entity.pref_label)}</div>
                ))}
            </SidebarItem>

            {/* CITATION */}

            <SidebarItem component="div" trans="dataset.citation" hideEmpty="false">
              {!this.state.harvested && <Citation />}
            </SidebarItem>
          </div>
        </ErrorBoundary>
      </SidebarContainer>
    )
  }
}

Sidebar.propTypes = {
  dataset: PropTypes.object.isRequired,
}

const SidebarContainer = styled.div`
  border: 2px solid rgb(231, 233, 237);
  word-wrap: break-word;
  word-break: break-word;
  -webkit-hyphens: auto;
  -moz-hyphens: auto;
  -ms-hyphens: auto;
  hyphens: auto;
  h4 {
    margin-bottom: 0;
  }
  > div {
    padding: 20px 0px;
  }
  .separator {
    &:after {
      content: '';
      display: block;
      height: 2px;
      background-color: ${props => props.theme.color.lightgray};
      position: relative;
      bottom: -20px;
      width: 100%;
    }
  }
`

const Item = styled.span`
  &:not(:last-child)::after {
    content: ', ';
  }
`
const Item2 = styled.span`
  &:not(:last-child)::after {
    content: '; ';
  }
`

export default inject('Stores')(observer(Sidebar))
