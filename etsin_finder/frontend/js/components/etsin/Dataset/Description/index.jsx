import React, { useEffect } from 'react'
import { observer } from 'mobx-react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import checkDataLang, { getDataLang } from '@/utils/checkDataLang'
import { dateSeparator } from '@/utils/dateFormat'
import ErrorBoundary from '@/components/general/errorBoundary'
import { useStores } from '@/utils/stores'

import DatasetInfoItem from '../DatasetInfoItem'
import Controls from './Controls'
import CustomMarkdown from './customMarkdown'
import DatasetDateInfo from './DatasetDateInfo'
import GoToOriginal from './goToOriginal'
import PreservationInfo from './PreservationInfo'
import TogglableAgentList from './togglableAgentList'

const Description = ({ id }) => {
  const {
    Matomo: { recordEvent },
    Accessibility,
    Etsin: {
      fetchVersions,
      isLoading,
      EtsinDataset: {
        dataset,
        identifier,
        isHarvested,
        hasFiles,
        hasRemoteResources,
        files,
        remoteResources,
        versions,
      },
    },
  } = useStores()

  useEffect(() => {
    const versionFetchFunction = async () => {
      await fetchVersions()
    }

    if (versions.length === 0 && !isLoading.versions) versionFetchFunction()
    Accessibility.handleNavigation('dataset', false)
    recordEvent(`DETAILS / ${identifier}`)
  }, [versions, isLoading, identifier, Accessibility, fetchVersions, recordEvent])

  const formatDatasetInfoArray = array => array?.join(', ') || null

  const getFileTypes = () => {
    let dataFileTypes
    if (hasFiles) {
      dataFileTypes = Object.values(files.originalMetadata).map(file =>
        file.fileTypeLabel ? checkDataLang(file.fileTypeLabel) : null
      )
    }

    if (hasRemoteResources) {
      dataFileTypes = remoteResources.map(resource =>
        resource.file_type ? checkDataLang(resource.file_type.pref_label) : null
      )
    }
    const fileTypeList = [...new Set(dataFileTypes)].filter(type => type).sort()
    return formatDatasetInfoArray(fileTypeList)
  }

  const getSpatialCoverage = () =>
    dataset.spatial && (
      <ul>
        {dataset.spatial.map(location => {
          if (!location.geographic_name) return null
          if (location.geographic_name !== checkDataLang(location?.place_uri?.pref_label)) {
            return (
              <li key={location.geographic_name} lang={getDataLang(location.place_uri.pref_label)}>
                {checkDataLang(location.place_uri.pref_label)}{' '}
                <span>({location.geographic_name})</span>
              </li>
            )
          }
          return <li key={location.geographic_name}>{location.geographic_name}</li>
        })}
      </ul>
    )

  const getTemporalCoverage = () =>
    dataset.temporal && (
      <ul>
        {dataset.temporal.map(dates => (
          <li key={`temporal-${dates.start_date}-${dates.end_date}`}>
            {dateSeparator(dates.start_date, dates.end_date)}
          </li>
        ))}
      </ul>
    )

  const getLanguages = () => {
    if (!dataset.language) return null
    const infoArray = dataset.language.map(language => checkDataLang(language.title))
    return formatDatasetInfoArray(infoArray)
  }

  const getFieldsOfScience = () => {
    if (!dataset.field_of_science) return null
    const infoArray = dataset.field_of_science.map(field => checkDataLang(field.pref_label))
    return formatDatasetInfoArray(infoArray)
  }

  return (
    <div className="dsContent tabContent" id={id}>
      <Controls />
      <section>
        <PreservationInfo />
        <div className="d-flex justify-content-between basic-info">
          <MainInfo>
            <ErrorBoundary>
              <TogglableAgentList agents={dataset.creator} agentType="creator" />
            </ErrorBoundary>
            <ErrorBoundary>
              <TogglableAgentList agents={dataset.contributor} agentType="contributor" />
            </ErrorBoundary>
            <DatasetDateInfo />
          </MainInfo>
        </div>

        <DescriptionArea>
          <DatasetInfoItem
            lang={getDataLang(dataset.description)}
            itemTitle={'dataset.description'}
          >
            {dataset.description && (
              <CustomMarkdown>{checkDataLang(dataset.description)}</CustomMarkdown>
            )}
          </DatasetInfoItem>

          <DatasetInfoItem itemTitle={'dataset.file_types'}>{getFileTypes()}</DatasetInfoItem>

          <DatasetInfoItem itemTitle={'dataset.field_of_science'}>
            {getFieldsOfScience()}
          </DatasetInfoItem>

          <DatasetInfoItem itemTitle={'dataset.keywords'}>
            {formatDatasetInfoArray(dataset.keyword)}
          </DatasetInfoItem>

          <DatasetInfoItem itemTitle={'dataset.language'}>{getLanguages()}</DatasetInfoItem>

          <DatasetInfoItem itemTitle={'dataset.spatial_coverage'}>
            {getSpatialCoverage()}
          </DatasetInfoItem>

          <DatasetInfoItem itemTitle={'dataset.temporal_coverage'}>
            {getTemporalCoverage()}
          </DatasetInfoItem>
        </DescriptionArea>

        {isHarvested && <GoToOriginal />}
      </section>
    </div>
  )
}

export default observer(Description)

Description.propTypes = {
  id: PropTypes.string.isRequired,
}

const MainInfo = styled.div`
  color: black;
  word-break: break-word;
  margin: 1em 0;
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
