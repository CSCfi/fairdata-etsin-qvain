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
import ReactMarkdown from 'react-markdown'

import AccessRights from './accessRights'
import FairdataPasDatasetIcon from './fairdataPasDatasetIcon'
import AskForAccess from './askForAccess'
import Contact from './contact'
import ErrorBoundary from '../../general/errorBoundary'
import GoToOriginal from './goToOriginal'
import Label from '../../general/label'
import TogglableAgentList from './togglableAgentList'
import VersionChanger from './versionChanger'
import FormatChanger from './formatChanger'
import checkDataLang, { getDataLang } from '@/utils/checkDataLang'
import checkNested from '@/utils/checkNested'
import dateFormat from '@/utils/dateFormat'
import { ACCESS_TYPE_URL, DATA_CATALOG_IDENTIFIER } from '@/utils/constants'
import { withStores } from '@/utils/stores'

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

class Description extends Component {
  componentDidMount() {
    const {
      Matomo: { recordEvent },
      Accessibility,
    } = this.props.Stores
    Accessibility.handleNavigation('dataset', false)
    recordEvent(`DETAILS / ${this.props.dataset.identifier}`)
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
    } = this.props.dataset.research_dataset
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
          <ErrorBoundary>
            <DatasetDescription lang={getDataLang(description)}>
              <CustomMarkdown>{checkDataLang(description)}</CustomMarkdown>
            </DatasetDescription>
          </ErrorBoundary>
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
`

const PasInfo = styled.div`
  color: ${p => p.theme.color.gray};
  font-size: 0.9em;
  padding-top: 5px;
  padding-bottom: 5px;
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

const CustomMarkdown = styled(ReactMarkdown)`
  > * {
    &:first-child {
      margin-top: 0 !important;
    }
    &:last-child {
      margin-bottom: 0 !important;
    }
  }

  a {
    color: ${p => p.theme.color.primary};
    text-decoration: none;
    &.absent {
      color: ${p => p.theme.color.error};
    }
    &.anchor {
      display: block;
      padding-left: 30px;
      margin-left: -30px;
      cursor: pointer;
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
    }
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    margin: 20px 0 10px;
    padding: 0;
    font-weight: bold;
    -webkit-font-smoothing: antialiased;
    cursor: text;
    position: relative;
  }

  h2:first-child {
    margin-top: 0;
    padding-top: 0;
  }

  h1:first-child {
    margin-top: 0;
    padding-top: 0;
    + h2 {
      margin-top: 0;
      padding-top: 0;
    }
  }

  h3:first-child,
  h4:first-child,
  h5:first-child,
  h6:first-child {
    margin-top: 0;
    padding-top: 0;
  }

  h1:hover a.anchor,
  h2:hover a.anchor,
  h3:hover a.anchor,
  h4:hover a.anchor,
  h5:hover a.anchor,
  h6:hover a.anchor {
    text-decoration: none;
  }

  h1 {
    tt,
    code {
      font-size: inherit;
    }
  }

  h2 {
    tt,
    code {
      font-size: inherit;
    }
  }

  h3 {
    tt,
    code {
      font-size: inherit;
    }
  }

  h4 {
    tt,
    code {
      font-size: inherit;
    }
  }

  h5 {
    tt,
    code {
      font-size: inherit;
    }
  }

  h6 {
    tt,
    code {
      font-size: inherit;
    }
  }

  h1 {
    font-size: 28px;
    color: black;
  }

  h2 {
    font-size: 24px;
    border-bottom: 1px solid ${p => p.theme.color.medgray};
    color: black;
  }

  h3 {
    font-size: 18px;
  }

  h4 {
    font-size: 16px;
  }

  h5 {
    font-size: 14px;
  }

  h6 {
    color: ${p => p.theme.color.darkgray};
    font-size: 14px;
  }

  p,
  blockquote,
  ul,
  ol,
  dl,
  li,
  table,
  pre {
    margin: 15px 0;
  }

  hr {
    border: 0 none;
    color: ${p => p.theme.color.medgray};
    height: 4px;
    padding: 0;
  }

  body > {
    h2:first-child {
      margin-top: 0;
      padding-top: 0;
    }
    h1:first-child {
      margin-top: 0;
      padding-top: 0;
      + h2 {
        margin-top: 0;
        padding-top: 0;
      }
    }
    h3:first-child,
    h4:first-child,
    h5:first-child,
    h6:first-child {
      margin-top: 0;
      padding-top: 0;
    }
  }

  a:first-child {
    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
      margin-top: 0;
      padding-top: 0;
    }
  }

  h1 p,
  h2 p,
  h3 p,
  h4 p,
  h5 p,
  h6 p {
    margin-top: 0;
  }

  li p.first {
    display: inline-block;
  }

  ul,
  ol {
    padding-left: 30px;
    list-style: initial;
  }

  ul :first-child,
  ol :first-child {
    margin-top: 0;
  }

  ul :last-child,
  ol :last-child {
    margin-bottom: 0;
  }

  dl {
    padding: 0;
    dt {
      font-size: 14px;
      font-weight: bold;
      font-style: italic;
      padding: 0;
      margin: 15px 0 5px;
      &:first-child {
        padding: 0;
      }
      > {
        :first-child {
          margin-top: 0;
        }
        :last-child {
          margin-bottom: 0;
        }
      }
    }
    dd {
      margin: 0 0 15px;
      padding: 0 15px;
      > {
        :first-child {
          margin-top: 0;
        }
        :last-child {
          margin-bottom: 0;
        }
      }
    }
  }

  blockquote {
    border-left: 4px solid ${p => p.theme.color.medgray};
    padding: 0 15px;
    color: ${p => p.theme.color.darkgray};
    > {
      :first-child {
        margin-top: 0;
      }
      :last-child {
        margin-bottom: 0;
      }
    }
  }

  table {
    padding: 0;
    tr {
      border-top: 1px solid ${p => p.theme.color.medgray};
      background-color: white;
      margin: 0;
      padding: 0;
      &:nth-child(2n) {
        background-color: ${p => p.theme.color.superlightgray};
      }
      th {
        font-weight: bold;
        border: 1px solid ${p => p.theme.color.medgray};
        text-align: left;
        margin: 0;
        padding: 6px 13px;
      }
      td {
        border: 1px solid ${p => p.theme.color.medgray};
        text-align: left;
        margin: 0;
        padding: 6px 13px;
      }
      th :first-child,
      td :first-child {
        margin-top: 0;
      }
      th :last-child,
      td :last-child {
        margin-bottom: 0;
      }
    }
  }

  img {
    max-width: 100%;
  }

  span {
    &.frame {
      display: block;
      overflow: hidden;
      > span {
        border: 1px solid ${p => p.theme.color.medgray};
        display: block;
        float: left;
        overflow: hidden;
        margin: 13px 0 0;
        padding: 7px;
        width: auto;
      }
      span {
        img {
          display: block;
          float: left;
        }
        span {
          clear: both;
          color: #333333;
          display: block;
          padding: 5px 0 0;
        }
      }
    }
    &.align-center {
      display: block;
      overflow: hidden;
      clear: both;
      > span {
        display: block;
        overflow: hidden;
        margin: 13px auto 0;
        text-align: center;
      }
      span img {
        margin: 0 auto;
        text-align: center;
      }
    }
    &.align-right {
      display: block;
      overflow: hidden;
      clear: both;
      > span {
        display: block;
        overflow: hidden;
        margin: 13px 0 0;
        text-align: right;
      }
      span img {
        margin: 0;
        text-align: right;
      }
    }
    &.float-left {
      display: block;
      margin-right: 13px;
      overflow: hidden;
      float: left;
      span {
        margin: 13px 0 0;
      }
    }
    &.float-right {
      display: block;
      margin-left: 13px;
      overflow: hidden;
      float: right;
      > span {
        display: block;
        overflow: hidden;
        margin: 13px auto 0;
        text-align: right;
      }
    }
  }
  code,
  tt {
    margin: 0 2px;
    padding: 0 5px;
    white-space: nowrap;
    background-color: ${p => p.theme.color.superlightgray};
    border-radius: 3px;
  }
  pre code {
    margin: 0;
    line-height: 1em;
    padding: 0;
    white-space: pre;
    border: none;
    background: transparent;
  }

  pre {
    background-color: ${p => p.theme.color.superlightgray};
    overflow: auto;
    padding: 9px 15px;
    border-radius: 5px;
    margin-bottom: 10px;
  }

  pre code,
  pre tt {
    background-color: transparent;
    border: none;
  }
`
