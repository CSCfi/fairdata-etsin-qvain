import { observer } from 'mobx-react'
import styled from 'styled-components'
import Translate from '@/utils/Translate'
import { useStores } from '@/stores/stores'

import { ACCESS_TYPE_URL } from '@/utils/constants'
import checkNested from '@/utils/checkNested'

import Agent from '../Agent'
import CitationButton from '../citation/citationButton'
import DatasetInfoItem from '../DatasetInfoItem'
import DatasetMetrics from './metrics'
import Identifier from './identifier'
import License from './special/license'
import Logo from './special/logo'
import Project from './special/project'
import SidebarArea from './SidebarArea'
import VersionChanger from './versionChanger'
import OtherIdentifiers from './OtherIdentifiers'
import { includeURNAndDOI } from '@/utils/includeURNAndDOI'
import ExpandableDatasetInfoItem from '../ExpandableDatasetInfoItem'

const Sidebar = () => {
  const {
    Etsin: {
      EtsinDataset: {
        dataset,
        dataCatalog,
        datasetMetadata,
        draftOf,
        isDraft,
        isCumulative,
        accessRights,
        persistentIdentifier,
        otherIdentifiers,
        actors,
      },
    },

    Locale: { getPreferredLang, getValueTranslation },
  } = useStores()

  const catalogPublisher = dataCatalog?.publisher
  const catalogPublisherLang = getPreferredLang(catalogPublisher?.name)
  const catalogPublisherHomepage = catalogPublisher?.homepage?.[0]?.url || ''
  const catalogTitle = dataCatalog?.title[catalogPublisherLang]

  // Initiate an array with only DOI or URN formatted items:
  const URNandDOIIdentifiers = otherIdentifiers.map(v => v.notation).filter(includeURNAndDOI)

  function getAccessRights() {
    const isOpen = accessRights?.access_type?.url === ACCESS_TYPE_URL.OPEN
    if (!isOpen && accessRights?.restriction_grounds?.length > 0) {
      return accessRights.restriction_grounds.map(rg => (
        <ListItem key={`rg-${rg.url}`} lang={getPreferredLang(rg.pref_label)}>
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
      return <Identifier idn={draftOf.persistent_identifier} />
    }

    return <Identifier idn={persistentIdentifier} />
  }

  function subjectHeading() {
    if (datasetMetadata.subjectHeading) {
      return (
        <List id="subject-heading">
          {datasetMetadata.subjectHeading.map(theme => (
            <li key={Object.values(theme.pref_label)[0]}>
              <SubjectHeaderLink
                href={theme.url}
                target="_blank"
                rel="noopener noreferrer"
                title={theme.url}
              >
                {getValueTranslation(theme.pref_label)}
              </SubjectHeaderLink>
            </li>
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

  const metricsTooltip = {
    infoText: 'dataset.metrics.toolTip',
    infoAriaLabel: 'dataset.metrics.tooltipLabel',
  }

  return (
    <SidebarContainer id="sidebar">
      {!isDraft && <VersionChanger />}
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
          {catalogPublisher?.name && getValueTranslation(catalogPublisher.name)}
        </DatasetInfoItem>
      </SidebarArea>

      <SidebarArea id="identifier-area">
        <DatasetInfoItem
          id="dataset-identifier"
          itemTitle="dataset.identifier"
          tooltip={identifierTooltip()}
        >
          {identifierInfo()}
          {isCumulative && (
            <div>
              <Translate content="dataset.dl.cumulativeDatasetLabel" />
            </div>
          )}
        </DatasetInfoItem>
        {URNandDOIIdentifiers?.length > 0 && (
          <ExpandableDatasetInfoItem
            id="dataset-other-identifier"
            itemTitle="dataset.events_idn.other_idn"
          >
            <OtherIdentifiers otherIdentifiers={URNandDOIIdentifiers} />
          </ExpandableDatasetInfoItem>
        )}
      </SidebarArea>

      <SidebarArea id="cite-area">
        <DatasetInfoItem id="dataset-citation" itemTitle="dataset.citation.titleShort">
          <CitationButton />
        </DatasetInfoItem>
      </SidebarArea>

      {dataset.metrics && (
        <SidebarArea id="metrics-area">
          <DatasetInfoItem
            id="dataset-metrics"
            itemTitle="dataset.metrics.title"
            tooltip={metricsTooltip}
          >
            <DatasetMetrics />
          </DatasetInfoItem>
        </SidebarArea>
      )}

      <SidebarArea id="subject-heading-area">
        <DatasetInfoItem id="dataset-theme" itemTitle="dataset.subjectHeading">
          {subjectHeading()}
        </DatasetInfoItem>
      </SidebarArea>

      <SidebarArea id="rights-area">
        <DatasetInfoItem id="dataset-license" itemTitle="dataset.license">
          {accessRights.license?.length && (
            <List id="rights">
              {accessRights?.license?.map(l => (
                <ListItem key={l.url}>
                  <License license={l} />
                </ListItem>
              ))}
            </List>
          )}
        </DatasetInfoItem>

        <DatasetInfoItem id="dataset-access-rights" itemTitle="dataset.access_rights">
          <List id="access-rights">{getAccessRights()}</List>
        </DatasetInfoItem>
      </SidebarArea>

      <SidebarArea id="actors-area">
        <DatasetInfoItem id="dataset-project" itemTitle="dataset.project.project_area">
          {datasetMetadata.projects?.length && (
            <List id="projects">
              {datasetMetadata.projects?.map(item => {
                const projectName = getValueTranslation(item.title)
                return (
                  <ListItem key={`li-${projectName}`} lang={getPreferredLang(item.title)}>
                    <Project project={item} />
                  </ListItem>
                )
              })}
            </List>
          )}
        </DatasetInfoItem>

        {actors.publisher && (
          <DatasetInfoItem id="dataset-publisher" itemTitle="dataset.publisher">
            <List id="agency">
              <Agent
                lang={getPreferredLang(actors.publisher.organization?.pref_label)}
                key={
                  actors.publisher.person?.name ||
                  getValueTranslation(actors.publisher.organization?.pref_label)
                }
                first
                agent={actors.publisher}
                popup
                Align="sidebar"
              />
            </List>
          </DatasetInfoItem>
        )}

        <DatasetInfoItem id="dataset-curator" itemTitle="dataset.curator">
          <List id="curators">
            {actors.curators?.map(curator => {
              const curatorName =
                curator.person?.name || getValueTranslation(curator.organization?.pref_label)
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
          {actors.rightsHolders.length && (
            <List id="rights-holder">
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
          <List id="infrastructures">
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

const ListItem = styled.li`
  &:not(:last-child) {
    margin-bottom: 0.5rem;
  }
`

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
