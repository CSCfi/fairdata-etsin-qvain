import React from 'react'
import { observer } from 'mobx-react'
import styled from 'styled-components'
import Translate from 'react-translate-component'
import { useStores } from '@/stores/stores'

import { ACCESS_TYPE_URL } from '@/utils/constants'
import checkNested from '@/utils/checkNested'

import Agent from '../Agent'
import CitationButton from '../citation/citationButton'
import DatasetInfoItem from '../DatasetInfoItem'
import Identifier from './identifier'
import License from './special/license'
import Logo from './special/logo'
import Project from './special/project'
import SidebarArea from './SidebarArea'
import VersionChanger from './versionChanger'

const Sidebar = () => {
  const {
    Etsin: {
      EtsinDataset: {
        dataCatalog,
        identifier,
        datasetMetadata,
        draftOf,
        isDraft,
        isCumulative,
        accessRights,
        versions,
        persistentIdentifier,
        actors,
      },
    },

    Locale: { getPreferredLang, getValueTranslation },
  } = useStores()

  const isVersion = versions?.some(version => version.identifier === identifier)
  const catalogPublisher = dataCatalog?.publisher
  const catalogPublisherLang = getPreferredLang(catalogPublisher?.name)
  const catalogPublisherHomepage = catalogPublisher.homepage?.[0].identifier || ''
  const catalogTitle = dataCatalog?.title[catalogPublisherLang]

  function getAccessRights() {
    const isOpen = accessRights?.access_type.identifier === ACCESS_TYPE_URL.OPEN
    if (!isOpen && accessRights?.restriction_grounds?.length > 0) {
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

  function identifierInfo() {
    if (isDraft && !draftOf) {
      return <Translate content="dataset.draftIdentifierInfo" />
    }

    if (draftOf) {
      return <Identifier idn={draftOf.preferred_identifier} />
    }

    return <Identifier idn={persistentIdentifier} />
  }

  function subjectHeading() {
    if (datasetMetadata.subjectHeading) {
      return (
        <List>
          {datasetMetadata.subjectHeading.map(theme => (
            <SubjectHeaderLink
              key={Object.values(theme.pref_label)[0]}
              href={theme.url}
              target="_blank"
              rel="noopener noreferrer"
              title={theme.url}
            >
              {getValueTranslation(theme.pref_label)}
            </SubjectHeaderLink>
          ))}
        </List>
      )
    }
    return null
  }

  const identifierTooltip = () =>
    isCumulative
      ? {
          infoText: 'dataset.dl.cumulativeDatasetTooltip.info',
          infoAriaLabel: 'dataset.dl.cumulativeDatasetTooltip.header',
        }
      : null

  return (
    <SidebarContainer id="sidebar">
      {dataCatalog.dataset_versioning && !isDraft && isVersion && <VersionChanger />}
      <SidebarArea id="data-catalog-area">
        {dataCatalog?.logo && (
          <DatasetInfoItem id="catalog-logo">
            <Translate
              component={Logo}
              attributes={{ alt: 'dataset.catalog_alt_text' }}
              with={{ title: catalogTitle }}
              file={dataCatalog.logo}
              url={catalogPublisherHomepage}
            />
          </DatasetInfoItem>
        )}

        <DatasetInfoItem
          id="catalog-publisher"
          itemTitle="dataset.catalog_publisher"
          lang={catalogPublisherLang}
        >
          {catalogPublisher.name && getValueTranslation(catalogPublisher.name)}
        </DatasetInfoItem>
      </SidebarArea>

      <SidebarArea id="identifier-area">
        <DatasetInfoItem
          id="dataset-identifier"
          itemTitle="dataset.identifier"
          tooltip={identifierTooltip()}
        >
          {identifierInfo()}
          {isCumulative && <Translate content="dataset.dl.cumulativeDatasetLabel" />}
        </DatasetInfoItem>
      </SidebarArea>

      <SidebarArea id="cite-area">
        <DatasetInfoItem id="dataset-citation" itemTitle="dataset.citation.titleShort">
          <CitationButton />
        </DatasetInfoItem>
      </SidebarArea>

      <SidebarArea id="subject-heading-area">
        <DatasetInfoItem id="dataset-theme" itemTitle="dataset.subjectHeading">
          {subjectHeading()}
        </DatasetInfoItem>
      </SidebarArea>

      <SidebarArea id="rights-area">
        <DatasetInfoItem id="dataset-license" itemTitle="dataset.license">
          <List>
            {accessRights?.license &&
              accessRights.license.map(l => (
                <ListItem key={l.url}>
                  <License license={l} />
                </ListItem>
              ))}
          </List>
        </DatasetInfoItem>

        {accessRights && (
          <DatasetInfoItem id="dataset-access-rights" itemTitle="dataset.access_rights">
            <List>{getAccessRights()}</List>
          </DatasetInfoItem>
        )}
      </SidebarArea>

      <SidebarArea id="actors-area">
        <DatasetInfoItem id="dataset-project" itemTitle="dataset.project.project">
          <List>
            {datasetMetadata.projects &&
              datasetMetadata.projects.map(item => {
                const projectName = getValueTranslation(item.name)
                return (
                  <ListItem key={`li-${projectName}`} lang={getPreferredLang(item.name)}>
                    <Project project={item} />
                  </ListItem>
                )
              })}
          </List>
        </DatasetInfoItem>

        <DatasetInfoItem id="dataset-publisher" itemTitle="dataset.publisher">
          {actors.publisher && (
            <List>
              <Agent
                lang={getPreferredLang(actors.publisher.organization?.pref_label)}
                key={
                  actors.publisher.person?.name ||
                  getValueTranslation(actors.publisher.organization?.pref_label)
                }
                first
                agent={actors.publisher}
                popupAlign="sidebar"
              />
            </List>
          )}
        </DatasetInfoItem>

        <DatasetInfoItem id="dataset-curator" itemTitle="dataset.curator">
          <List>
            {actors.curators &&
              actors.curators.map(curator => {
                const curatorName =
                  curator.person?.name ||
                  getValueTranslation(curator.organization?.pref_label)
                return (
                  <Agent
                    key={`li-${curatorName}`}
                    lang={getPreferredLang(curator.organization?.pref_label)}
                    first
                    agent={curator}
                    popupAlign="sidebar"
                  />
                )
              })}
          </List>
        </DatasetInfoItem>

        <DatasetInfoItem id="dataset-rights-holder" itemTitle="dataset.rights_holder">
          {actors.rightsHolders && (
            <List>
              {actors.rightsHolders.map(rh => {
                const rightsHolderName =
                  rh.person?.name || getValueTranslation(rh.organization?.pref_label)
                return (
                  <Agent
                    key={`li-${rightsHolderName}`}
                    lang={getPreferredLang(rh.organization?.pref_label)}
                    first
                    agent={rh}
                    popupAlign="sidebar"
                  />
                )
              })}
            </List>
          )}
        </DatasetInfoItem>
      </SidebarArea>

      <SidebarArea id="infrastructure-area">
        <DatasetInfoItem id="dataset-infrastructure" itemTitle="dataset.infrastructure">
          <List>
            {datasetMetadata.infrastructure?.map(entity => (
              <ListItem key={entity.id} lang={getPreferredLang(entity.pref_label)}>
                {getValueTranslation(entity.pref_label)}
              </ListItem>
            ))}
          </List>
        </DatasetInfoItem>
      </SidebarArea>
    </SidebarContainer>
  )
}

const List = styled.ul`
  list-style: none;
`

const ListItem = styled.li``

const SidebarContainer = styled.div`
  word-wrap: break-word;
  word-break: break-word;
  -webkit-hyphens: auto;
  -moz-hyphens: auto;
  -ms-hyphens: auto;
  hyphens: auto;
  padding: 1em 0 0 0;

  > * {
    margin-bottom: 0.5em;
  }
`

const SubjectHeaderLink = styled.a`
  display: block;
`

export default observer(Sidebar)
