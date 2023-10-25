import React, { useEffect } from 'react'
import { observer } from 'mobx-react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import ErrorBoundary from '@/components/general/errorBoundary'
import { useStores } from '@/utils/stores'

import DatasetInfoItem from '../DatasetInfoItem'
import Controls from './Controls'
import CustomMarkdown from './customMarkdown'
import DatasetDateInfo from './DatasetDateInfo'
import GoToOriginal from './goToOriginal'
import TogglableAgentList from './togglableAgentList'
import FormatChanger from './formatChanger'

const Description = ({ id }) => {
  const {
    Matomo: { recordEvent },
    Accessibility,
    Etsin: {
      EtsinDataset: {
        datasetMetadata,
        identifier,
        isRemoved,
        isHarvested,
        hasFiles,
        hasRemoteResources,
        files,
        remoteResources,
        creators,
        contributors,
      },
    },
    Locale: { dateSeparator, getPreferredLang, getValueTranslation },
  } = useStores()

  useEffect(() => {
    Accessibility.handleNavigation('dataset', false)
    recordEvent(`DETAILS / ${identifier}`)
  }, [identifier, Accessibility, recordEvent])

  const formatDatasetInfoArray = array => array?.join(', ') || null

  const getFileTypes = () => {
    let dataFileTypes
    if (hasFiles) {
      dataFileTypes = files.root.files.map(file =>
        file.fileType ? getValueTranslation(file.fileType.pref_label) : null
      )
    }

    if (hasRemoteResources) {
      dataFileTypes = remoteResources.map(resource =>
        resource.file_type ? getValueTranslation(resource.file_type.pref_label) : null
      )
    }
    const fileTypeList = [...new Set(dataFileTypes)].filter(type => type).sort()
    return formatDatasetInfoArray(fileTypeList)
  }

  const getSpatialCoverage = () =>
    datasetMetadata.spatial && (
      <ul>
        {datasetMetadata.spatial.map(location => {
          if (!location.geographic_name) return null
          if (
            location.reference?.pref_label &&
            location.geographic_name !== getValueTranslation(location.reference.pref_label)
          ) {
            return (
              <li
                key={location.geographic_name}
                lang={getPreferredLang(location.reference.pref_label)}
              >
                {getValueTranslation(location.reference.pref_label)}{' '}
                <span>({location.geographic_name})</span>
              </li>
            )
          }
          return <li key={location.geographic_name}>{location.geographic_name}</li>
        })}
      </ul>
    )

  const getTemporalCoverage = () =>
    datasetMetadata.temporal && (
      <ul>
        {datasetMetadata.temporal.map(dates => (
          <li key={`temporal-${dates.start_date}-${dates.end_date}`}>
            {dateSeparator(dates.start_date, dates.end_date)}
          </li>
        ))}
      </ul>
    )

  const getLanguages = () => {
    if (!datasetMetadata.language) return null
    const infoArray = datasetMetadata.language.map(language =>
      getValueTranslation(language.pref_label)
    )
    return formatDatasetInfoArray(infoArray)
  }

  const getFieldsOfScience = () => {
    if (!datasetMetadata.fieldOfScience) return null
    const infoArray = datasetMetadata.fieldOfScience.map(field =>
      getValueTranslation(field.pref_label)
    )
    return formatDatasetInfoArray(infoArray)
  }

  return (
    <div className="dsContent tabContent" id={id}>
      <section>
        <MainInfo id="main-info">
          <TextInfo>
            <ErrorBoundary>
              <TogglableAgentList agents={creators} agentType="creator" />
            </ErrorBoundary>
            <ErrorBoundary>
              <TogglableAgentList agents={contributors} agentType="contributor" />
            </ErrorBoundary>
            <DatasetDateInfo />
          </TextInfo>
          <Controls />
        </MainInfo>

        <DescriptionArea>
          <DatasetInfoItem
            lang={getPreferredLang(datasetMetadata.description)}
            itemTitle={'dataset.description'}
          >
            {datasetMetadata.description && (
              <CustomMarkdown>{getValueTranslation(datasetMetadata.description)}</CustomMarkdown>
            )}
          </DatasetInfoItem>

          <DatasetInfoItem itemTitle={'dataset.file_types'}>{getFileTypes()}</DatasetInfoItem>

          <DatasetInfoItem itemTitle={'dataset.field_of_science'}>
            {getFieldsOfScience()}
          </DatasetInfoItem>

          <DatasetInfoItem itemTitle={'dataset.keywords'}>
            {formatDatasetInfoArray(datasetMetadata.keywords)}
          </DatasetInfoItem>

          <DatasetInfoItem itemTitle={'dataset.language'}>{getLanguages()}</DatasetInfoItem>

          <DatasetInfoItem itemTitle={'dataset.spatial_coverage'}>
            {getSpatialCoverage()}
          </DatasetInfoItem>

          <DatasetInfoItem itemTitle={'dataset.temporal_coverage'}>
            {getTemporalCoverage()}
          </DatasetInfoItem>
        </DescriptionArea>

        {!isRemoved && <FormatChanger />}
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
  display: flex;
  color: black;
  line-height: 1.5;
  margin-bottom: 1.5em;
`

const TextInfo = styled.div`
  display: block;
  padding-right: 1.2rem;
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
