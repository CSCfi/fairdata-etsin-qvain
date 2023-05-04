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
import { observer } from 'mobx-react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import Translate from 'react-translate-component'
import { Link } from 'react-router-dom'

import CustomMarkdown from './customMarkdown'
import AccessRights from '../accessRights'
import FairdataPasDatasetIcon from '../fairdataPasDatasetIcon'
import AskForAccess from './askForAccess'
import Contact from '../contact'
import ErrorBoundary from '@/components/general/errorBoundary'
import GoToOriginal from './goToOriginal'
import Label from '@/components/general/label'
import TogglableAgentList from './togglableAgentList'
import VersionChanger from './versionChanger'
import FormatChanger from './formatChanger'
import DatasetInfoItem from '../DatasetInfoItem'
import checkDataLang, { getDataLang } from '@/utils/checkDataLang'
import checkNested from '@/utils/checkNested'
import dateFormat, { dateSeparator } from '@/utils/dateFormat'
import { ACCESS_TYPE_URL, DATA_CATALOG_IDENTIFIER } from '@/utils/constants'
import { withStores } from '@/utils/stores'

class Description extends Component {
  componentDidMount() {
    const {
      Matomo: { recordEvent },
      Accessibility,
    } = this.props.Stores
    Accessibility.handleNavigation('dataset', false)
    recordEvent(`DETAILS / ${this.props.dataset.identifier}`)
  }

  getSpatialCoverage(locations) {
    return locations && (
      <ul>
        {locations.map((location) => {
          if (
            location.geographic_name &&
            checkNested(location, 'place_uri', 'pref_label') &&
            location.geographic_name !== checkDataLang(location.place_uri.pref_label)
          ) {
            return (
              <li key={location.geographic_name} lang={getDataLang(location.place_uri.pref_label)}>
                {checkDataLang(location.place_uri.pref_label)} <span>({location.geographic_name})</span>
              </li>
            )
          }
          if (location.geographic_name) {
            return <li key={location.geographic_name}>{location.geographic_name}</li>
          }
          return null
        })}
      </ul>
    )
  }

  getTemporalCoverage(temporal) {
    return temporal && (
      <ul>
        {temporal.map(dates => (
        <li key={`temporal-${dates.start_date}-${dates.end_date}`}>
          {dateSeparator(dates.start_date, dates.end_date)}
        </li>
      ))}
      </ul>
    )
  }

  getLanguages(languages) {
    if (languages) {
      const infoArray = []
      {languages.map(language => 
        infoArray.push(checkDataLang(language.title))
      )}
      return this.formatDatasetInfoArray(infoArray)
    }
    return null
  }

  getFieldsOfScience(fields) {
    if (fields) {
      const infoArray = []
      {fields.map(field => 
        infoArray.push(checkDataLang(field.pref_label))
      )}
      return this.formatDatasetInfoArray(infoArray)
    }
    return null
  }

  formatDatasetInfoArray(array) {
    return array?.join(', ') || null
  }

  checkEmails(obj) {
    for (const o in obj) if (obj[o]) return true
    return false
  }

  render() {
    const { id } = this.props
    const {
      creator,
      cumulative,
      contributor,
      harvested,
      title,
      issued,
      modified,
      description,
      access_rights: accessRights,
      preferred_identifier: preferredIdentifier,
      field_of_science: field,
      keyword,
      language,
    } = this.props.dataset.research_dataset
    const location = checkNested(this.props.dataset.research_dataset, 'spatial') ? this.props.dataset.research_dataset.spatial : false
    const temporal = checkNested(this.props.dataset.research_dataset, 'temporal') ? this.props.dataset.research_dataset.temporal : false
    const versions = this.props.dataset.dataset_version_set
    const datasetIdentifier = this.props.dataset.identifier
    const isVersion =
      versions &&
      versions.length > 0 &&
      versions.some(version => version.identifier === datasetIdentifier)

    return (
      <div className="dsContent" id={id}>
        <Labels>
          <Controls>
            {this.props.dataset.data_catalog.catalog_json.dataset_versioning && isVersion && (
              <VersionChanger versionSet={versions} idn={datasetIdentifier} />
            )}
            {(this.props.dataset.data_catalog.catalog_json.identifier ===
              DATA_CATALOG_IDENTIFIER.PAS ||
              this.props.dataset.preservation_state === 80) && (
                <FairdataPasDatasetIcon
                  preservation_state={this.props.dataset.preservation_state}
                  data_catalog_identifier={this.props.dataset.data_catalog.catalog_json.identifier}
                />
              )}
            <MarginAfter>
              <AccessRights
                button
                access_rights={
                  checkNested(
                    this.props.dataset,
                    'research_dataset',
                    'access_rights',
                    'access_type'
                  )
                    ? accessRights
                    : null
                }
              />
            </MarginAfter>
            <FormatChanger idn={this.props.match.params.identifier} />
            <Flex>
              <ErrorBoundary>
                {this.checkEmails(this.props.emails) && !this.props.harvested && (
                  <Contact
                    datasetID={datasetIdentifier}
                    emails={this.props.emails}
                    // TEMPORARY: rems check won't be needed in contact later.
                    isRems={
                      this.props.dataset.research_dataset.access_rights.access_type.identifier ===
                      ACCESS_TYPE_URL.PERMIT
                    }
                  />
                )}
              </ErrorBoundary>
              <AskForAccess cr_id={datasetIdentifier} />
            </Flex>
          </Controls>
        </Labels>
        <section>
          <div>
            {this.props.dataset.data_catalog.catalog_json.identifier ===
              DATA_CATALOG_IDENTIFIER.PAS && (
                <PasInfo>
                  <Translate content="dataset.storedInPas" />
                </PasInfo>
              )}
            {this.props.dataset.preservation_dataset_origin_version && (
              <PasInfo>
                <Translate content="dataset.originalDatasetVersionExists" />
                <Link
                  to={`/dataset/${this.props.dataset.preservation_dataset_origin_version.identifier}`}
                >
                  <Translate content="dataset.linkToOriginalDataset" />
                </Link>
              </PasInfo>
            )}
            {this.props.dataset.preservation_dataset_version && (
              <PasInfo>
                <Translate content="dataset.pasDatasetVersionExists" />
                <Link to={`/dataset/${this.props.dataset.preservation_dataset_version.identifier}`}>
                  <Translate content="dataset.linkToPasDataset" />
                </Link>
              </PasInfo>
            )}
          </div>
          <div className="d-md-flex align-items-center dataset-title justify-content-between">
            <Title lang={getDataLang(title)}>{checkDataLang(title)}</Title>
          </div>
          <div className="d-flex justify-content-between basic-info">
            <MainInfo>
              <ErrorBoundary>
                <TogglableAgentList agents={creator} agentType="creator" />
              </ErrorBoundary>
              <ErrorBoundary>
                <TogglableAgentList agents={contributor} agentType="contributor" />
              </ErrorBoundary>
              {issued && (
                <p lang={getDataLang(issued)}>
                  <Translate
                    content="dataset.issued"
                    with={{ date: dateFormat(checkDataLang(issued), { format: 'date' }) }}
                  />
                  <br />
                  {modified && (
                    <Translate
                      content="dataset.modified"
                      with={{ date: dateFormat(checkDataLang(modified), { format: 'date' }) }}
                    />
                  )}
                </p>
              )}
            </MainInfo>
          </div>
          <DescriptionArea>
            
            {/* DESCRIPTION */}

            <DatasetInfoItem
              lang={getDataLang(description)}
              itemTitle={"dataset.description"}>
              {description && <CustomMarkdown>{checkDataLang(description)}</CustomMarkdown>}
            </DatasetInfoItem>

            {/* FIELD OF SCIENCE */}

            <DatasetInfoItem
              itemTitle={"dataset.field_of_science"}>
                {this.getFieldsOfScience(field)}
            </DatasetInfoItem>

            {/* KEYWORDS */}

            <DatasetInfoItem
              itemTitle={"dataset.keywords"}>
                {this.formatDatasetInfoArray(keyword)}
            </DatasetInfoItem>

            {/* LANGUAGES */}

            <DatasetInfoItem
              itemTitle={"dataset.language"}>
                {this.getLanguages(language)}
            </DatasetInfoItem>

            {/* SPATIAL COVERAGE */}

            <DatasetInfoItem
              itemTitle={"dataset.spatial_coverage"}>
                {this.getSpatialCoverage(location)}
            </DatasetInfoItem>

            {/* TEMPORAL COVERAGE */}

            <DatasetInfoItem
              itemTitle={"dataset.temporal_coverage"}>
                {this.getTemporalCoverage(temporal)}
            </DatasetInfoItem>
            

          </DescriptionArea>

          {cumulative && (
            <Label color="error">
              <Translate content="dataset.cumulative" />
            </Label>
          )}
          {harvested && (
            <>
              <GoToOriginal idn={preferredIdentifier} />
              <label htmlFor="dataset-tags">
                <Translate
                  id="dataset-tags"
                  content="dataset.tags"
                  className="sr-only"
                  element="span"
                />
                {/* this should be named as tag rather than label */}
                <Label>
                  <Translate content="dataset.harvested" />
                </Label>
              </label>
            </>
          )}
        </section>
      </div>
    )
  }
}

export default withStores(observer(Description))

Description.propTypes = {
  Stores: PropTypes.object.isRequired,
  dataset: PropTypes.object.isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      identifier: PropTypes.string,
    }),
  }).isRequired,
  emails: PropTypes.shape({
    CONTRIBUTOR: PropTypes.bool,
    CREATOR: PropTypes.bool,
    CURATOR: PropTypes.bool,
    PUBLISHER: PropTypes.bool,
    RIGHTS_HOLDER: PropTypes.bool,
  }).isRequired,
  harvested: PropTypes.bool.isRequired,
  cumulative: PropTypes.bool.isRequired,
  id: PropTypes.string.isRequired,
}

const Title = styled.h1`
  margin-bottom: 0.1rem;
  color: ${p => p.theme.color.superdarkgray};
  word-break: break-word;
`

const MainInfo = styled.div`
  color: ${p => p.theme.color.darkgray};
  font-size: 0.9em;
  word-break: break-word;
  margin-bottom: 1em;
`

const PasInfo = styled.div`
  color: ${p => p.theme.color.gray};
  font-size: 0.9em;
  padding-top: 5px;
  padding-bottom: 5px;
`

const Labels = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  align-items: center;
  margin-bottom: 0.5em;
`

const Flex = styled.div`
  display: flex;
  align-items: stretch;
  > * {
    margin: 0.25rem;
  }
`

const MarginAfter = styled.div`
  display: flex;
  align-items: stretch;
`

const Controls = styled.div`
  display: flex;
  flex-wrap: wrap;
  flex-grow: 1;
  margin: -0.25rem;
  > * {
    margin: 0.25rem;
  }
  > ${Flex} {
    margin: 0;
  }
  > ${MarginAfter} {
    margin-right: auto;
  }
`
const DescriptionArea = styled.dl`
  > * {
    padding: 1.5rem;
    border-left: 2px solid ${p => p.theme.color.primary};
    @media screen and (min-width: ${p => p.theme.breakpoints.sm}) {
      padding: 0em 1.5rem;
    }
  }

  > dd {
    margin-bottom: 2em;
    padding-top: 0.7em;
    padding-bottom: 0.1em;
  }
`