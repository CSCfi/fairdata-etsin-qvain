import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Translate from 'react-translate-component'
import { inject, observer } from 'mobx-react'

import dateFormat from 'Utils/dateFormat'
import checkNested from 'Utils/checkNested'
import checkDataLang from 'Utils/checkDataLang'
import Button from '../general/button'
import Label from '../general/label'
import AccessRights from './data/accessRights'
import ErrorBoundary from '../general/errorBoundary'
import Person from './person'
import Contact from './contact'
import VersionChanger from './versionChanger'

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

  checkEmails(obj) {
    for (const o in obj) if (obj[o]) return true
    return false
  }

  render() {
    return (
      <div className="dsContent">
        <Labels>
          <Flex>
            <VersionChanger />
            <AccessRights
              access_rights={
                checkNested(this.props.dataset, 'access_rights', 'access_type')
                  ? this.props.dataset.access_rights
                  : null
              }
            />
          </Flex>
          <Flex>
            <ErrorBoundary>
              {this.checkEmails(this.props.emails) && !this.props.harvested && (
                <Contact
                  datasetID={this.props.dataset.research_dataset.preferred_identifier}
                  emails={this.props.emails}
                />
              )}
            </ErrorBoundary>
            <Button onClick={() => alert('Hae käyttölupaa')} noMargin>
              <Translate content="dataset.access_permission" />
            </Button>
          </Flex>
        </Labels>
        <div className="d-md-flex align-items-center dataset-title justify-content-between">
          <h1>{checkDataLang(this.state.title)}</h1>
        </div>
        <div className="d-flex justify-content-between basic-info">
          <div>
            <ErrorBoundary>
              <Person creator={this.state.creator} />
            </ErrorBoundary>
            <ErrorBoundary>
              <Person contributor={this.state.contributor} />
            </ErrorBoundary>
          </div>
          <p>{this.state.issued ? dateFormat(checkDataLang(this.state.issued)) : null}</p>
        </div>
        <ErrorBoundary>
          {/* currently displays only first description */}
          {/* {this.state.description.map(desc => <p className="description">{checkDataLang(desc)}</p>)} */}
          <p className="description">{checkDataLang(this.state.description[0])}</p>
        </ErrorBoundary>
        {this.props.cumulative && <Label color="#f35">Cumulative</Label>}
        {this.props.harvested && <Label>Harvested</Label>}
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
