import React from 'react'
import { observer } from 'mobx-react'
import styled from 'styled-components'
import Translate from 'react-translate-component'
import { useStores } from '@/stores/stores'

import Agent from '../Agent'
import CitationButton from '../citation/citationButton'
import DatasetInfoItem from '../DatasetInfoItem'
import DatasetIsCumulativeNotificationBar from '@/components/etsin/general/datasetIsCumulativeNotificationBar'
import Identifier from './identifier'
import License from './special/license'
import Logo from './special/logo'
import Project from './special/project'
import SidebarArea from './SidebarArea'
import checkDataLang, { getDataLang } from '@/utils/checkDataLang'
import checkNested from '@/utils/checkNested'
import { ACCESS_TYPE_URL } from '@/utils/constants'

const Sidebar = () => {
  const {
    Etsin: {
      EtsinDataset: { dataCatalog, dataset, isDraft, isCumulative, accessRights },
    },
  } = useStores()

  const catalogPublisher = dataCatalog?.publisher
  const catalogPublisherLang = getDataLang(catalogPublisher?.name)
  const catalogPublisherHomepage = checkNested(dataCatalog, 'publisher', 'homepage')
    ? dataCatalog.publisher.homepage[0].identifier
    : ''
  const catalogTitle = dataCatalog?.title[catalogPublisherLang]

  function getAccessRights() {
    const isOpen = accessRights?.access_type.identifier === ACCESS_TYPE_URL.OPEN
    if (!isOpen && accessRights?.restriction_grounds?.length > 0) {
      return accessRights.restriction_grounds.map(rg => (
        <ListItem key={`rg-${rg.identifier}`} lang={getDataLang(rg.pref_label)}>
          {checkDataLang(rg.pref_label)}
        </ListItem>
      ))
    }
    return (
      checkNested(accessRights, 'access_type', 'pref_label') && (
        <ListItem lang={getDataLang(accessRights.access_type.pref_label)}>
          {checkDataLang(accessRights.access_type.pref_label)}
        </ListItem>
      )
    )
  }

  function identifier() {
    if (isDraft && !dataset.draftOf) {
      return <Translate content="dataset.draftIdentifierInfo" />
    }

    if (dataset.draftOf) {
      return <Identifier idn={dataset.draftOf.preferred_identifier} />
    }

    const pid = dataset.preferred_identifier
    return <Identifier idn={pid} />
  }

  function subjectHeading() {
    const labels = []
    if (dataset.theme) {
      labels.push(
        ...dataset.theme.map(theme => (
          <SubjectHeaderLink
            key={theme.identifier}
            href={theme.identifier}
            target="_blank"
            rel="noopener noreferrer"
            title={theme.identifier}
          >
            {checkDataLang(theme.pref_label)}
          </SubjectHeaderLink>
        ))
      )
    }
    return labels
  }

  return (
    <SidebarContainer id="sidebar">
      <SidebarArea id="data-catalog-area">
        {dataCatalog?.logo && (
          <DatasetInfoItem id="catalog-logo">
            <Translate
              component={Logo}
              attributes={{ alt: 'dataset.catalog_alt_text' }}
              with={{ catalogTitle }}
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
          {catalogPublisher.name && checkDataLang(catalogPublisher.name)}
        </DatasetInfoItem>
      </SidebarArea>

      <SidebarArea id="identifier-area">
        <DatasetInfoItem id="dataset-identifier" itemTitle="dataset.identifier">
          {identifier()}
          {isCumulative && (
            <SidebarContainerForCumulativeInfo>
              <DatasetIsCumulativeNotificationBar directionToDisplayTooltip="Left" />
            </SidebarContainerForCumulativeInfo>
          )}
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
              accessRights.license.map(rights => (
                <ListItem key={rights.identifier}>
                  <License data={rights} />
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
            {dataset?.is_output_of &&
              dataset.is_output_of.map(item => {
                const projectName = checkDataLang(item.name)
                return (
                  <ListItem key={`li-${projectName}`} lang={getDataLang(item.name)}>
                    <Project project={item} />
                  </ListItem>
                )
              })}
          </List>
        </DatasetInfoItem>

        <DatasetInfoItem id="dataset-publisher" itemTitle="dataset.publisher">
          {dataset.publisher && (
            <List>
              <Agent
                lang={getDataLang(dataset.publisher.name)}
                key={checkDataLang(dataset.publisher) || dataset.publisher.name}
                first
                agent={dataset.publisher}
                popupAlign="sidebar"
              />
            </List>
          )}
        </DatasetInfoItem>

        <DatasetInfoItem id="dataset-curator" itemTitle="dataset.curator">
          <List>
            {dataset.curator &&
              dataset.curator.map(actor => {
                let curatorName = checkDataLang(actor.name)
                if (curatorName === '') {
                  curatorName = actor.name
                }
                return (
                  <Agent
                    key={`li-${curatorName}`}
                    lang={getDataLang(actor.name)}
                    first
                    agent={actor}
                    popupAlign="sidebar"
                  />
                )
              })}
          </List>
        </DatasetInfoItem>

        <DatasetInfoItem id="dataset-rights-holder" itemTitle="dataset.rights_holder">
          {dataset.rights_holder && (
            <List>
              {dataset.rights_holder.map(actor => {
                let rightsHolderName = checkDataLang(actor.name)
                if (rightsHolderName === '') {
                  rightsHolderName = actor.name
                }
                return (
                  <Agent
                    key={`li-${rightsHolderName}`}
                    lang={getDataLang(actor.name)}
                    first
                    agent={actor}
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
            {dataset?.infrastructure?.map(entity => (
              <ListItem key={entity.identifier} lang={getDataLang(entity.pref_label)}>
                {checkDataLang(entity.pref_label)}
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
  padding: 20px 0 0 0;
`

const SidebarContainerForCumulativeInfo = styled.div`
  padding: 0.5em 0em 0em 0em;
`

const SubjectHeaderLink = styled.a`
  display: block;
`

export default observer(Sidebar)
