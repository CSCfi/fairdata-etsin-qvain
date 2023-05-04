import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { observer } from 'mobx-react'
import Translate from 'react-translate-component'

import checkDataLang, { getDataLang } from '@/utils/checkDataLang'
import checkNested from '@/utils/checkNested'
import SidebarArea from './SidebarArea'
import DatasetInfoItem from '../DatasetInfoItem'
import Identifier from './identifier'
import Logo from './special/logo'
import License from './special/license'
import Agent from '../Agent'
import Project from './special/project'
import DatasetIsCumulativeNotificationBar from '@/components/etsin/general/datasetIsCumulativeNotificationBar'
import { withStores } from '@/stores/stores'
import CitationButton from '../citation/citationButton'
import { ACCESS_TYPE_URL } from '@/utils/constants'

class Sidebar extends Component {
  subjectHeading() {
    const researchDataset = this.props.dataset.research_dataset
    const labels = []
    if (researchDataset.theme) {
      labels.push(
        ...researchDataset.theme.map(theme => (
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

  identifier() {
    const researchDataset = this.props.dataset.research_dataset
    const isDraft = this.props.dataset.state === 'draft'
    const draftOf = this.props.dataset.draft_of
    if (isDraft && !draftOf) {
      return <Translate content="dataset.draftIdentifierInfo" />
    }

    if (draftOf) {
      return <Identifier idn={draftOf.preferred_identifier} />
    }

    const pid = researchDataset.preferred_identifier
    return <Identifier idn={pid} />
  }

  accessRights() {
    const researchDataset = this.props.dataset.research_dataset
    const accessRights = checkNested(researchDataset, 'access_rights')
      ? researchDataset.access_rights
      : false

    const isOpen = accessRights.access_type.identifier === ACCESS_TYPE_URL.OPEN
    if (!isOpen && accessRights.restriction_grounds?.length > 0) {
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

  render() {
    const { setShowCitationModal } = this.props.Stores.DatasetQuery
    const dataCatalog = this.props.dataset.data_catalog
    const researchDataset = this.props.dataset.research_dataset

    // sidebar data
    const catalogPublisher = checkNested(dataCatalog, 'catalog_json', 'publisher', 'name')
      ? dataCatalog.catalog_json.publisher.name
      : false
    const publisher = researchDataset.publisher
    const catalogTitle = dataCatalog.catalog_json.title
    const catalogPublisherHomepage = checkNested(
      dataCatalog,
      'catalog_json',
      'publisher',
      'homepage'
    )
      ? dataCatalog.catalog_json.publisher.homepage[0].identifier
      : ''
    const logo = dataCatalog.catalog_json.logo
    const license = checkNested(researchDataset, 'access_rights', 'license')
      ? researchDataset.access_rights.license
      : false
    const accessRights = checkNested(researchDataset, 'access_rights')
      ? researchDataset.access_rights
      : false
    const isOutputOf = checkNested(researchDataset, 'is_output_of')
      ? researchDataset.is_output_of
      : false
    const curator = researchDataset.curator
    const rightsHolder = researchDataset.rights_holder
    const infrastructure = checkNested(researchDataset, 'infrastructure')
      ? researchDataset.infrastructure
      : false
    const title = catalogTitle[getDataLang(catalogPublisher)]

    return (
      <SidebarContainer>

        {/* DATA CATALOG INFORMATION AREA */}
        <SidebarArea>

          {/* DATA CATALOG LOGO */}
          {logo && (
            <DatasetInfoItem>
              <Translate
                component={Logo}
                attributes={{ alt: 'dataset.catalog_alt_text' }}
                with={{ title }}
                file={logo}
                url={catalogPublisherHomepage}
              />
            </DatasetInfoItem>
          )}

          {/* DATA CATALOG PUBLISHER */}
          <DatasetInfoItem
            itemTitle="dataset.catalog_publisher"
            lang={getDataLang(catalogPublisher)}
          >
            {catalogPublisher && checkDataLang(catalogPublisher)}
          </DatasetInfoItem>
        </SidebarArea>

        {/* PREFERRED IDENTIFIER AREA */}
        <SidebarArea>
          <DatasetInfoItem 
            itemTitle="dataset.identifier"
          >
            {this.identifier()}
            
            {
              /* INFORMATION DISPLAYED FOR CUMULATIVE DATASETS */
              this.props.dataset.cumulative_state === 1 && (
                <SidebarContainerForCumulativeInfo>
                  <DatasetIsCumulativeNotificationBar directionToDisplayTooltip="Left" />
                </SidebarContainerForCumulativeInfo>
              )
            }
          </DatasetInfoItem>
        </SidebarArea>

        {/* CITE AREA */}
        <SidebarArea>
          <DatasetInfoItem 
            itemTitle="dataset.citation.titleShort"
          >
            <CitationButton setShowCitationModal={setShowCitationModal} />
          </DatasetInfoItem>
        </SidebarArea>

        {/* SUBJECT HEADING AREA */}
        <SidebarArea>
          <DatasetInfoItem 
            itemTitle="dataset.subjectHeading"
          >
              {this.subjectHeading()}
          </DatasetInfoItem>
        </SidebarArea>

        {/* RIGHTS AREA */}
        <SidebarArea>

          {/* LICENSE */}
          <DatasetInfoItem 
            itemTitle="dataset.license"
          >
            <List>
              {license &&
                license.map(rights => (
                  <ListItem key={rights.identifier}>
                    <License data={rights} />
                  </ListItem>
                ))}
            </List>
          </DatasetInfoItem>

          {/* ACCESS RIGHTS RESTRICTION_GROUNDS */}
          {accessRights && (
            <DatasetInfoItem 
              itemTitle="dataset.access_rights"
            >
              <List>{this.accessRights()}</List>
            </DatasetInfoItem>
          )}
        </SidebarArea>

        {/* ACTORS AREA */}
        <SidebarArea>

          {/* PROJECTS */}
          <DatasetInfoItem 
            itemTitle="dataset.project.project"
          >
            <List>
              {isOutputOf &&
                isOutputOf.map(item => {
                  const projectName = checkDataLang(item.name)
                  return (
                    <ListItem key={`li-${projectName}`} lang={getDataLang(item.name)}>
                      <Project project={item} />
                    </ListItem>
                  )
                })}
            </List>
          </DatasetInfoItem>

          {/* PUBLISHER */}
          <DatasetInfoItem 
            itemTitle="dataset.publisher"
          >
            {publisher && (
              <List>
                <Agent
                  lang={getDataLang(publisher.name)}
                  key={checkDataLang(publisher) || publisher.name}
                  first
                  agent={publisher}
                  popupAlign="sidebar"
                />
              </List>
            )}
          </DatasetInfoItem>

          {/* CURATOR */}
          <DatasetInfoItem 
            itemTitle="dataset.curator"
          >
            <List>
              {curator &&
                curator.map(actor => {
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

          {/* RIGHTS HOLDER */}
          <DatasetInfoItem 
            itemTitle="dataset.rights_holder"
          >
            {rightsHolder && (
              <List>
                {rightsHolder.map(actor => {
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

        {/* INFRASTRUCTURE AREA */}
        {infrastructure && (
          <SidebarArea>
            <DatasetInfoItem 
              itemTitle="dataset.infrastructure"
            >
              <List>
                {infrastructure.map(entity => (
                  <ListItem key={entity.identifier} lang={getDataLang(entity.pref_label)}>
                    {checkDataLang(entity.pref_label)}
                  </ListItem>
                ))}
              </List>
            </DatasetInfoItem>
          </SidebarArea>
        )}
      </SidebarContainer>
    )
  }
}

Sidebar.propTypes = {
  dataset: PropTypes.object.isRequired,
  Stores: PropTypes.object.isRequired,
}

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

const List = styled.ul`
  list-style: none;
`

const ListItem = styled.li``

export default withStores(observer(Sidebar))
