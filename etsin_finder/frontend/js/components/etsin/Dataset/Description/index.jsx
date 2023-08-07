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
import { withStores } from '@/utils/stores'

class Description extends Component {
  async componentDidMount() {
    const {
      Matomo: { recordEvent },
      Accessibility,
      Etsin: {
        fetchVersions,
        isLoading,
        EtsinDataset: { identifier, versions },
      },
    } = this.props.Stores

    if (versions.length === 0 && !isLoading.versions) await fetchVersions()
    Accessibility.handleNavigation('dataset', false)
    recordEvent(`DETAILS / ${identifier}`)
  }

  getSpatialCoverage(locations) {
    return (
      locations && (
        <ul>
          {locations.map(location => {
            if (
              location.geographic_name &&
              checkNested(location, 'place_uri', 'pref_label') &&
              location.geographic_name !== checkDataLang(location.place_uri.pref_label)
            ) {
              return (
                <li
                  key={location.geographic_name}
                  lang={getDataLang(location.place_uri.pref_label)}
                >
                  {checkDataLang(location.place_uri.pref_label)}{' '}
                  <span>({location.geographic_name})</span>
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
    )
  }

  getTemporalCoverage(temporal) {
    return (
      temporal && (
        <ul>
          {temporal.map(dates => (
            <li key={`temporal-${dates.start_date}-${dates.end_date}`}>
              {dateSeparator(dates.start_date, dates.end_date)}
            </li>
          ))}
        </ul>
      )
    )
  }

  getLanguages(languages) {
    if (languages) {
      const infoArray = []
      {
        languages.map(language => infoArray.push(checkDataLang(language.title)))
      }
      return this.formatDatasetInfoArray(infoArray)
    }
    return null
  }

  getFieldsOfScience(fields) {
    if (fields) {
      const infoArray = []
      {
        fields.map(field => infoArray.push(checkDataLang(field.pref_label)))
      }
      return this.formatDatasetInfoArray(infoArray)
    }
    return null
  }

  getFileTypes(dataInfo) {
    let dataFileTypes
    if (dataInfo.hasFiles) {
      dataFileTypes = Object.values(dataInfo.files.originalMetadata).map(file =>
        file.fileTypeLabel ? checkDataLang(file.fileTypeLabel) : null
      )
    }

    if (dataInfo.hasRemoteResources) {
      dataFileTypes = dataInfo.remoteResources.map(resource =>
        resource.file_type ? checkDataLang(resource.file_type.pref_label) : null
      )
    }
    const fileTypeList = [...new Set(dataFileTypes)].filter(type => type).sort()
    return this.formatDatasetInfoArray(fileTypeList)
  }

  formatDatasetInfoArray(array) {
    return array?.join(', ') || null
  }

  checkEmails(obj) {
    for (const o in obj) if (obj[o]) return true
    return false
  }

  render() {
    const {
      Etsin: {
        EtsinDataset: {
          dataCatalog,
          catalogRecord,
          dataset,
          identifier,
          versions,
          emailInfo,
          isHarvested,
          isCumulative,
          isPas,
          hasFiles,
          hasRemoteResources,
          files,
          remoteResources,
        },
      },
    } = this.props.Stores

    const dataInfo = { hasFiles, hasRemoteResources, files, remoteResources }
    const { id } = this.props
    const isVersion =
      versions && versions.length > 0 && versions.some(version => version.identifier === identifier)

    return (
      <div className="dsContent" id={id}>
        <Labels>
          <Controls>
            {dataCatalog.dataset_versioning && isVersion && <VersionChanger />}
            {(isPas || catalogRecord.preservation_state === 80) && <FairdataPasDatasetIcon />}
            <MarginAfter>
              <AccessRights button />
            </MarginAfter>
            <FormatChanger />
            <Flex>
              <ErrorBoundary>
                {this.checkEmails(emailInfo) && !isHarvested && <Contact />}
              </ErrorBoundary>
              <AskForAccess />
            </Flex>
          </Controls>
        </Labels>

        <section>
          <div>
            {isPas && (
              <PasInfo>
                <Translate content="dataset.storedInPas" />
              </PasInfo>
            )}
            {catalogRecord.preservation_dataset_origin_version && (
              <PasInfo>
                <Translate content="dataset.originalDatasetVersionExists" />
                <Link
                  to={`/dataset/${catalogRecord.preservation_dataset_origin_version.identifier}`}
                >
                  <Translate content="dataset.linkToOriginalDataset" />
                </Link>
              </PasInfo>
            )}
            {catalogRecord.preservation_dataset_version && (
              <PasInfo>
                <Translate content="dataset.pasDatasetVersionExists" />
                <Link to={`/dataset/${catalogRecord.preservation_dataset_version.identifier}`}>
                  <Translate content="dataset.linkToPasDataset" />
                </Link>
              </PasInfo>
            )}
          </div>

          <div className="d-md-flex align-items-center dataset-title justify-content-between">
            <Title lang={getDataLang(dataset.title)}>{checkDataLang(dataset.title)}</Title>
          </div>

          <div className="d-flex justify-content-between basic-info">
            <MainInfo>
              <ErrorBoundary>
                <TogglableAgentList agents={dataset.creator} agentType="creator" />
              </ErrorBoundary>
              <ErrorBoundary>
                <TogglableAgentList agents={dataset.contributor} agentType="contributor" />
              </ErrorBoundary>
              {dataset.issued && (
                <p lang={getDataLang(dataset.issued)}>
                  <Translate
                    content="dataset.issued"
                    with={{ date: dateFormat(checkDataLang(dataset.issued), { format: 'date' }) }}
                  />
                  <br />
                  {dataset.modified && (
                    <Translate
                      content="dataset.modified"
                      with={{
                        date: dateFormat(checkDataLang(dataset.modified), { format: 'date' }),
                      }}
                    />
                  )}
                </p>
              )}
            </MainInfo>
          </div>

          <DescriptionArea>
            {/* DESCRIPTION */}

            <DatasetInfoItem
              lang={getDataLang(dataset.description)}
              itemTitle={'dataset.description'}
            >
              {dataset.description && (
                <CustomMarkdown>{checkDataLang(dataset.description)}</CustomMarkdown>
              )}
            </DatasetInfoItem>

            {/* FILE TYPE */}

            <DatasetInfoItem itemTitle={'dataset.file_types'}>
              {this.getFileTypes(dataInfo)}
            </DatasetInfoItem>

            {/* FIELD OF SCIENCE */}

            <DatasetInfoItem itemTitle={'dataset.field_of_science'}>
              {this.getFieldsOfScience(dataset.field_of_science)}
            </DatasetInfoItem>

            {/* KEYWORDS */}

            <DatasetInfoItem itemTitle={'dataset.keywords'}>
              {this.formatDatasetInfoArray(dataset.keyword)}
            </DatasetInfoItem>

            {/* LANGUAGES */}

            <DatasetInfoItem itemTitle={'dataset.language'}>
              {this.getLanguages(dataset.language)}
            </DatasetInfoItem>

            {/* SPATIAL COVERAGE */}

            <DatasetInfoItem itemTitle={'dataset.spatial_coverage'}>
              {this.getSpatialCoverage(dataset.spatial)}
            </DatasetInfoItem>

            {/* TEMPORAL COVERAGE */}

            <DatasetInfoItem itemTitle={'dataset.temporal_coverage'}>
              {this.getTemporalCoverage(dataset.temporal)}
            </DatasetInfoItem>
          </DescriptionArea>

          {isCumulative && (
            <Label color="error">
              <Translate content="dataset.cumulative" />
            </Label>
          )}

          {isHarvested && (
            <>
              <GoToOriginal />
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
