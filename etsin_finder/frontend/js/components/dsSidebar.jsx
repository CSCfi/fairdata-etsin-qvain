import React, { Component } from 'react'
import Translate from 'react-translate-component'
import DsSidebarItem from './dsSidebarItem'
import Locale from '../stores/view/language'
import checkNested from './checkNested'

export default class DsSidebar extends Component {
  dateSeparator(start, end) {
    return start && end
      ? `${start} - ${end}`
      : start + end
  }

  render() {
    const researchDataset = this.props.dataset.research_dataset
    const dataCatalog = this.props.dataset.data_catalog
    const { currentLang } = Locale
    const isOutputOf = researchDataset.is_output_of
    console.log(this.props.dataset.research_dataset)

    return (
      <div className="sidebar content-box">
        <div className="separator">
          <DsSidebarItem component="p" trans="dataset.publisher" fallback="Publisher">
            {
              checkNested(researchDataset, 'publisher', 'name')
              ? researchDataset.publisher.name[currentLang]
              : null
            }
          </DsSidebarItem>
        </div>
        <div className="separator">
          <DsSidebarItem component="p" trans="dataset.doi" fallback="DOI">
            {researchDataset.preferred_identifier}
          </DsSidebarItem>
        </div>
        <div>
          <DsSidebarItem component="p" trans="dataset.project" fallback="Project" hideEmpty="true">
            {
              isOutputOf
                ? researchDataset.is_output_of.map(item => item.name[currentLang])
                : null
            }
          </DsSidebarItem>
          <DsSidebarItem component="div" trans="dataset.field_of_science" fallback="Field of Science" hideEmpty="true">
            {dataCatalog.catalog_json.field_of_science.map(field => (
              <p key={field.identifier}>
                {field.pref_label[this.props.lang]}
              </p>
            ))}
          </DsSidebarItem>
          <DsSidebarItem component="p" trans="dataset.keywords" fallback="Keywords" hideEmpty="true">
            {
              researchDataset.keyword
                ? researchDataset.keyword.map(keyword => <span className="keyword" key={keyword}>{keyword} </span>)
                : null
            }
          </DsSidebarItem>
          <DsSidebarItem component="p" trans="dataset.spatial_coverage" fallback="Spatial Coverage" hideEmpty="true">
            {
              checkNested(researchDataset, 'spatial', 'geographic_name')
                ? researchDataset.spatial.geographic_name
                : null
            }
          </DsSidebarItem>
          <DsSidebarItem component="p" trans="dataset.temporal_coverage" fallback="Temporal Coverage" hideEmpty="true">
            {
              checkNested(researchDataset, 'temporal')
                ? this.dateSeparator(
                  researchDataset.temporal.start_date,
                  researchDataset.temporal.end_date,
                )
                : null
            }
          </DsSidebarItem>
          <DsSidebarItem component="div" trans="dataset.license" fallback="License" hideEmpty="true">
            {
              checkNested(dataCatalog, 'catalog_json', 'access_rights', 'licence')
                ? dataCatalog.catalog_json.access_rights.license.map(rights => (
                  <p key={rights.identifier}>
                    {rights.title[0][this.props.lang]}
                  </p>
                ))
                : null
            }
          </DsSidebarItem>
          <DsSidebarItem component="p" trans="dataset.access_rights" fallback="Access rights statement" hideEmpty="true">
            {
              checkNested(dataCatalog, 'catalog_json', 'access_rights', 'description')
                ? dataCatalog.catalog_json.access_rights.description[0][currentLang]
                : null
            }
          </DsSidebarItem>
          <DsSidebarItem component="p" trans="dataset.funder" fallback="Funder" hideEmpty="true">
            {
              checkNested(researchDataset, 'is_output_of', 'has_funding_agency', 'name')
                ? researchDataset.is_output_of.has_funding_agency.name
                : null
            }
          </DsSidebarItem>
          <DsSidebarItem component="p" trans="dataset.curator" fallback="Curator" hideEmpty="true">
            {researchDataset.curator ? researchDataset.curator.name : null}
          </DsSidebarItem>
          <DsSidebarItem component="p" trans="dataset.infrastructure" fallback="Infrastructure" hideEmpty="true">
            {
              checkNested(researchDataset, 'related_entity')
                ? researchDataset.related_entity.map(entity => entity.title[currentLang])
                : null
            }
          </DsSidebarItem>
          <DsSidebarItem component="p" trans="dataset.permanent_link" fallback="Permanent link to this page" hideEmpty="true">
            {
              `something/something/${researchDataset.urn_identifier}`
            }
          </DsSidebarItem>
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
