import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { inject, observer } from 'mobx-react'
import Translate from 'react-translate-component'
import translate from 'counterpart'

import Accessiblity from '../../stores/view/accessibility'
import dateFormat from '../../utils/dateFormat'
import checkNested from '../../utils/checkNested'
import checkDataLang from '../../utils/checkDataLang'
import Label from '../general/label'
import AccessRights from './accessRights'
import ErrorBoundary from '../general/errorBoundary'
import People from './people'
import Contact from './contact'
import VersionChanger from './versionChanger'
import GoToOriginal from './goToOriginal'
// import ShowMore from '../general/showMore'
// import Button from '../general/button'

const ReactMarkdown = require('react-markdown')

const Labels = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  align-items: center;
  margin-bottom: 0.5em;
`

const Flex = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 0.5em;
`

class Description extends Component {
  constructor(props) {
    super(props)
    const { creator, contributor, title, issued, description } = props.dataset.research_dataset
    this.state = {
      creator,
      contributor,
      title,
      issued,
      description,
    }
  }

  componentDidMount() {
    Accessiblity.setNavText(translate('nav.announcer.datasetPage'))
  }

  checkEmails(obj) {
    for (const o in obj) if (obj[o]) return true
    return false
  }

  render() {
    return (
      <div className="dsContent">
        <Labels>
          <Flex>
            {this.props.dataset.data_catalog.catalog_json.dataset_versioning &&
              this.props.dataset.dataset_version_set &&
              this.props.dataset.dataset_version_set[0] &&
              this.props.dataset.dataset_version_set.length > 1 && (
                <VersionChanger
                  versionSet={this.props.dataset.dataset_version_set}
                  idn={this.props.dataset.identifier}
                />
              )}
            <AccessRights
              button
              access_rights={
                checkNested(this.props.dataset, 'research_dataset', 'access_rights', 'access_type')
                  ? this.props.dataset.research_dataset.access_rights
                  : null
              }
            />
          </Flex>
          <Flex>
            <ErrorBoundary>
              {this.checkEmails(this.props.emails) &&
                !this.props.harvested && (
                  <Contact
                    datasetID={this.props.dataset.identifier}
                    emails={this.props.emails}
                    // TEMPORARY: rems check won't be needed in contact later.
                    isRems={
                      this.props.dataset.research_dataset.access_rights.access_type.identifier ===
                      'http://purl.org/att/es/reference_data/access_type/access_type_restricted_access_permit'
                    }
                  />
                )}
            </ErrorBoundary>
            {/* <Button onClick={() => alert('Hae käyttölupaa')} noMargin>
              <Translate content="dataset.access_permission" />
            </Button> */}
          </Flex>
        </Labels>
        <div className="d-md-flex align-items-center dataset-title justify-content-between">
          <Title>{checkDataLang(this.state.title)}</Title>
        </div>
        <div className="d-flex justify-content-between basic-info">
          <MainInfo>
            <ErrorBoundary>
              <People creator={this.state.creator} />
            </ErrorBoundary>
            <ErrorBoundary>
              <People contributor={this.state.contributor} />
            </ErrorBoundary>
            <p>{this.state.issued ? dateFormat(checkDataLang(this.state.issued)) : null}</p>
          </MainInfo>
        </div>
        <ErrorBoundary>
          <DatasetDescription>
            {/* <ShowMore
              min={100}
              more={<Translate content="general.showMore" />}
              less={<Translate content="general.showLess" />}
            > */}
            <ReactMarkdown source={checkDataLang(this.state.description)} />
            {/* </ShowMore> */}
          </DatasetDescription>
        </ErrorBoundary>
        {this.props.cumulative && (
          <Label color="error">
            <Translate content="dataset.cumulative" />
          </Label>
        )}
        {this.props.harvested && (
          <React.Fragment>
            <GoToOriginal idn={this.props.dataset.research_dataset.preferred_identifier} />
            <Label>
              <Translate content="dataset.harvested" />
            </Label>
          </React.Fragment>
        )}
      </div>
    )
  }
}

export default inject('Stores')(observer(Description))

Description.propTypes = {
  dataset: PropTypes.object.isRequired,
  emails: PropTypes.shape({
    CONTRIBUTOR: PropTypes.bool,
    CREATOR: PropTypes.bool,
    CURATOR: PropTypes.bool,
    PUBLISHER: PropTypes.bool,
    RIGHTS_HOLDER: PropTypes.bool,
  }).isRequired,
  harvested: PropTypes.bool.isRequired,
  cumulative: PropTypes.bool.isRequired,
}

const Title = styled.h1`
  margin-bottom: 0.1rem;
`

const MainInfo = styled.div`
  color: ${p => p.theme.color.gray};
  font-size: 0.9em;
`

const DatasetDescription = styled.div`
  padding: 0.5em 1em;
  margin-bottom: 1em;
  /* background-color: ${p => p.theme.color.superlightgray}; */
  border-left: 2px solid ${p => p.theme.color.primary};
  @media screen and (min-width: ${p => p.theme.breakpoints.sm}) {
    padding: 1em 2em;
  }
  p:last-of-type {
    margin-bottom: 0;
  }
`
