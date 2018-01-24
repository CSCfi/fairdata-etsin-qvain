import React, { Component } from 'react'
import Translate from 'react-translate-component'
import SidebarItem from './SidebarItem'
import Locale from '../../stores/view/language'
import checkNested from '../../utils/checkNested'
import DateFormat from './data/dateFormat'
import Identifier from './data/identifier'
import ErrorBoundary from '../general/errorBoundary'

import checkDataLang from '../../utils/checkDataLang'

export default class Sidebar extends Component {
  dateSeparator(start, end) {
    return start && end
      ? <p key={start}><DateFormat date={start} /> - <DateFormat date={end} /></p>
      : start + end
  }

  render() {
    const researchDataset = this.props.dataset.research_dataset
    const dataCatalog = this.props.dataset.data_catalog
    const { currentLang } = Locale
    const isOutputOf = researchDataset.is_output_of

    return (
      <div className="sidebar content-box">
        <div className="separator">
          <ErrorBoundary>
            <SidebarItem component="p" trans="dataset.publisher" fallback="Publisher">
              {
                checkNested(researchDataset, 'publisher', 'name')
                ? researchDataset.publisher.name[currentLang]
                : null
              }
            </SidebarItem>
          </ErrorBoundary>
        </div>
        <div className="separator">
          <ErrorBoundary>
            <SidebarItem component="p" trans="dataset.identifier" fallback="Identifier">
              <Identifier idn={researchDataset.preferred_identifier}>
                {researchDataset.preferred_identifier}
              </Identifier>
            </SidebarItem>
          </ErrorBoundary>
        </div>
        <div>
          <ErrorBoundary>
            <SidebarItem component="p" trans="dataset.project" fallback="Project" hideEmpty="true">
              {
                isOutputOf
                  ? researchDataset.is_output_of.map(item => item.name[currentLang])
                  : null
              }
            </SidebarItem>
          </ErrorBoundary>
          <ErrorBoundary>
            <SidebarItem component="div" trans="dataset.field_of_science" fallback="Field of Science" hideEmpty="true">
              {dataCatalog.catalog_json.field_of_science.map(field => (
                <p key={field.identifier}>
                  {field.pref_label[this.props.lang]}
                </p>
              ))}
            </SidebarItem>
          </ErrorBoundary>
          <ErrorBoundary>
            <SidebarItem component="p" trans="dataset.keywords" fallback="Keywords" hideEmpty="true">
              {
                researchDataset.keyword
                  ? researchDataset.keyword.map(keyword => <span className="keyword" key={keyword}>{keyword} </span>)
                  : null
              }
            </SidebarItem>
          </ErrorBoundary>
          <ErrorBoundary>
            <SidebarItem component="p" trans="dataset.spatial_coverage" fallback="Spatial Coverage" hideEmpty="true">
              {
                checkNested(researchDataset, 'spatial', 'geographic_name')
                  ? researchDataset.spatial.geographic_name
                  : null
              }
            </SidebarItem>
          </ErrorBoundary>
          <ErrorBoundary>
            <SidebarItem component="div" trans="dataset.temporal_coverage" fallback="Temporal Coverage" hideEmpty="true">
              {
                checkNested(researchDataset, 'temporal')
                  ? researchDataset.temporal.map(dates => this.dateSeparator(
                      dates.start_date,
                      dates.end_date,
                    ))
                  : null
              }
            </SidebarItem>
          </ErrorBoundary>
          <ErrorBoundary>
            <SidebarItem component="div" trans="dataset.license" fallback="License" hideEmpty="true">
              {
                checkNested(researchDataset, 'access_rights', 'license')
                  ? researchDataset.access_rights.license.map(rights => (
                    <p key={rights.identifier}>
                      {checkDataLang(rights.title, currentLang)}
                    </p>
                  ))
                  : null
              }
            </SidebarItem>
          </ErrorBoundary>
          <ErrorBoundary>
            <SidebarItem component="p" trans="dataset.access_rights" fallback="Access rights statement" hideEmpty="true">
              {
                checkNested(dataCatalog, 'catalog_json', 'access_rights', 'description')
                  ? checkDataLang(
                    dataCatalog.catalog_json.access_rights.description[0],
                    currentLang,
                  )
                  : null
              }
            </SidebarItem>
          </ErrorBoundary>
          <ErrorBoundary>
            <SidebarItem component="p" trans="dataset.funder" fallback="Funder" hideEmpty="true">
              {
                checkNested(researchDataset, 'is_output_of')
                  ? researchDataset.is_output_of.map(output => (
                    checkNested(output, 'has_funding_agency')
                    ? output.has_funding_agency.map(agency => (
                      checkDataLang(agency.name, currentLang)
                    ))
                    : null
                  ))
                  : null
              }
            </SidebarItem>
          </ErrorBoundary>
          <ErrorBoundary>
            <SidebarItem component="p" trans="dataset.curator" fallback="Curator" hideEmpty="true">
              {researchDataset.curator ? researchDataset.curator.map(curators => (
                checkDataLang(curators.name, currentLang)
              )) : null}
            </SidebarItem>
          </ErrorBoundary>
          <ErrorBoundary>
            <SidebarItem component="p" trans="dataset.infrastructure" fallback="Infrastructure" hideEmpty="true">
              {
                checkNested(researchDataset, 'related_entity')
                  ? researchDataset.related_entity.map(entity => (
                    checkDataLang(entity.title, currentLang)))
                  : null
              }
            </SidebarItem>
          </ErrorBoundary>
          <ErrorBoundary>
            <SidebarItem component="p" trans="dataset.permanent_link" fallback="Permanent link to this page" hideEmpty="true">
              {
                `something/something/${researchDataset.urn_identifier}`
              }
            </SidebarItem>
          </ErrorBoundary>
        </div>
        <div className="row no-gutters justify-content-md-center">
          <button type="button" className="btn btn-etsin-outline align-center">
            <Translate content="" />Näytä lisää tietoja
          </button>
        </div>
      </div>
    );
  }
}
