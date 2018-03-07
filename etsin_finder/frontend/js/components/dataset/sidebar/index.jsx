import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import styled from 'styled-components'
import SidebarItem from './sidebarItem'
import DateFormat from '../data/dateFormat'
import Identifier from '../data/identifier'
import Citation from '../data/citation'
import Image from '../../general/image'
import ErrorBoundary from '../../general/errorBoundary'
import checkNested from '../../../utils/checkNested'
import checkDataLang from '../../../utils/checkDataLang'

const Logo = styled.div`
  text-align: center;
  margin-bottom: 1em;
`

class Sidebar extends Component {
  constructor(props) {
    super(props)

    const dataCatalog = this.props.dataset.data_catalog
    const researchDataset = this.props.dataset.research_dataset

    // sidebar data
    this.state = {
      publisher: checkNested(dataCatalog, 'catalog_json', 'publisher', 'name')
        ? dataCatalog.catalog_json.publisher.name
        : false,
      logoAlt: dataCatalog.catalog_json.title,
      logo: dataCatalog.catalog_json.logo,
      pid: researchDataset.preferred_identifier,
      field: dataCatalog.catalog_json.field_of_science,
      keyword: researchDataset.keyword,
      geographic_name: checkNested(researchDataset, 'spatial', 'geographic_name')
        ? researchDataset.spatial.geographic_name
        : false,
      temporal: checkNested(researchDataset, 'temporal') ? researchDataset.temporal : false,
      licence: checkNested(researchDataset, 'access_rights', 'license')
        ? researchDataset.access_rights.licence
        : false,
      description: checkNested(dataCatalog, 'catalog_json', 'access_rights', 'description')
        ? dataCatalog.catalog_json.access_rights.description
        : false,
      isOutputOf: checkNested(researchDataset, 'is_output_of')
        ? researchDataset.is_output_of
        : false,
      curator: researchDataset.curator,
      related_entity: checkNested(researchDataset, 'related_entity')
        ? researchDataset.related_entity
        : false,
      urn: researchDataset.urn_identifier,
    }
  }

  dateSeparator(start, end) {
    return start && end ? (
      <p key={start}>
        <DateFormat date={start} /> - <DateFormat date={end} />
      </p>
    ) : (
      start + end
    )
  }

  render() {
    return (
      <div className="sidebar content-box">
        <div className="separator">
          <ErrorBoundary>
            {this.state.logo && (
              <Logo>
                <Image
                  alt={checkDataLang(this.state.logoAlt)}
                  file={`../../../${this.state.logo}`}
                />
              </Logo>
            )}
            <SidebarItem component="div" trans="dataset.publisher">
              {this.state.publisher && checkDataLang(this.state.publisher)}
            </SidebarItem>
          </ErrorBoundary>
        </div>
        <div className="separator">
          <ErrorBoundary>
            <SidebarItem component="p" trans="dataset.identifier">
              <Identifier idn={this.state.pid}>{this.state.pid}</Identifier>
            </SidebarItem>
          </ErrorBoundary>
        </div>
        <div>
          <ErrorBoundary>
            <SidebarItem component="p" trans="dataset.project" hideEmpty="true">
              {this.state.isOutputOf && this.state.isOutputOf.map(item => checkDataLang(item.name))}
            </SidebarItem>
          </ErrorBoundary>
          <ErrorBoundary>
            <SidebarItem
              component="div"
              trans="dataset.field_of_science"
              fallback="Field of Science"
              hideEmpty="true"
            >
              {this.state.field.map(field => (
                <p key={field.identifier}>{checkDataLang(field.pref_label)}</p>
              ))}
            </SidebarItem>
          </ErrorBoundary>
          <ErrorBoundary>
            <SidebarItem component="p" trans="dataset.keywords" hideEmpty="true">
              {this.state.keyword &&
                this.state.keyword.map(keyword => (
                  <span className="keyword" key={keyword}>
                    {keyword}{' '}
                  </span>
                ))}
            </SidebarItem>
          </ErrorBoundary>
          <ErrorBoundary>
            <SidebarItem
              component="p"
              trans="dataset.spatial_coverage"
              fallback="Spatial Coverage"
              hideEmpty="true"
            >
              {this.state.geographic_name && this.state.geographic_name}
            </SidebarItem>
          </ErrorBoundary>
          <ErrorBoundary>
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
          </ErrorBoundary>
          <ErrorBoundary>
            <SidebarItem component="div" trans="dataset.license" hideEmpty="true">
              {this.state.licence &&
                this.state.license.map(rights => (
                  <p key={rights.identifier}>{checkDataLang(rights.title)}</p>
                ))}
            </SidebarItem>
          </ErrorBoundary>
          <ErrorBoundary>
            <SidebarItem
              component="p"
              trans="dataset.access_rights"
              fallback="Access rights statement"
              hideEmpty="true"
            >
              {this.state.description && checkDataLang(this.state.description[0])}
            </SidebarItem>
          </ErrorBoundary>
          <ErrorBoundary>
            <SidebarItem component="p" trans="dataset.funder" hideEmpty="true">
              {this.state.isOutputOf &&
                this.state.isOutputOf.map(
                  output =>
                    checkNested(output, 'has_funding_agency') &&
                    output.has_funding_agency.map(agency => checkDataLang(agency.name))
                )}
            </SidebarItem>
          </ErrorBoundary>
          <ErrorBoundary>
            <SidebarItem component="p" trans="dataset.curator" hideEmpty="true">
              {this.state.curator &&
                this.state.curator.map(curators => checkDataLang(curators.name))}
            </SidebarItem>
          </ErrorBoundary>
          <ErrorBoundary>
            <SidebarItem component="p" trans="dataset.infrastructure" hideEmpty="true">
              {this.state.related_entity &&
                this.state.related_entity.map(entity => checkDataLang(entity.title))}
            </SidebarItem>
          </ErrorBoundary>
          <ErrorBoundary>
            <SidebarItem
              component="p"
              trans="dataset.permanent_link"
              fallback="Permanent link to this page"
              hideEmpty="true"
            >
              {`placeholder!/something/${this.state.urn}`}
            </SidebarItem>
          </ErrorBoundary>
          <ErrorBoundary>
            <SidebarItem component="div" trans="dataset.citation" hideEmpty="false">
              <Citation />
            </SidebarItem>
          </ErrorBoundary>
        </div>
      </div>
    )
  }
}

export default withRouter(Sidebar)
