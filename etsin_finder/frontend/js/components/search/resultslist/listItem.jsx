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
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import checkDataLang, { getDataLang } from '../../../utils/checkDataLang'
import ErrorBoundary from '../../general/errorBoundary'
import AccessRights from '../../dataset/accessRights'
import FairdataPasDatasetIcon from '../../dataset/fairdataPasDatasetIcon'
import ContentBox from '../../general/contentBox'

export default class ListItem extends Component {
  shortDescription(string) {
    // shortens description to 500
    if (string.length > 500) {
      let trimmed = string.substring(0, 499)
      // checks that words haven't been cut
      trimmed = `${trimmed.substr(0, Math.min(trimmed.length, trimmed.lastIndexOf(' ')))}...`
      return trimmed
    }
    return string
  }

  render() {
    return (
      <Item>
        <ErrorBoundary>
          <Link
            to={`/dataset/${this.props.catId}`}
            aria-label={`${checkDataLang(this.props.item.title)}: ${this.shortDescription(
              checkDataLang(this.props.item.description)
            )}`}
            lang={getDataLang(this.props.item.title)}
          >
            <ContentBox>
              <ErrorBoundary>
                <ItemHeader>
                  <h2 className="title" lang={getDataLang(this.props.item.title)}>
                    {checkDataLang(this.props.item.title)}
                  </h2>
                  <WrapperDivRight>
                    {
                      (
                        (this.props.item.data_catalog_identifier === 'urn:nbn:fi:att:data-catalog-pas')
                        ||
                        (this.props.item.preservation_state === 80)
                      )
                      &&
                      (
                        <FairdataPasDatasetIcon
                          preservation_state={this.props.item.preservation_state}
                          data_catalog_identifier={this.props.item.data_catalog_identifier}
                        />
                      )
                    }
                    <AccessRights
                      access_rights={this.props.item.access_rights}
                    />
                  </WrapperDivRight>
                </ItemHeader>
              </ErrorBoundary>
              <ErrorBoundary>
                {Array.isArray(this.props.item.field_of_science) && (
                  <div className="basic-info">
                    <p>
                      {this.props.item.field_of_science.map(field => (
                        <span lang={getDataLang(field.pref_label)}>
                          checkDataLang(field.pref_label)
                        </span>
                      ))}
                    </p>
                  </div>
                )}
              </ErrorBoundary>
              <ErrorBoundary>
                <p lang={getDataLang(this.props.item.description)}>
                  {this.shortDescription(checkDataLang(this.props.item.description))}
                </p>
              </ErrorBoundary>
            </ContentBox>
          </Link>
        </ErrorBoundary>
      </Item>
    )
  }
}

ListItem.propTypes = {
  catId: PropTypes.string.isRequired,
  item: PropTypes.shape({
    title: PropTypes.object.isRequired,
    access_rights: PropTypes.object,
    preservation_state: PropTypes.number,
    field_of_science: PropTypes.array,
    description: PropTypes.object.isRequired,
    data_catalog: PropTypes.object,
    data_catalog_identifier: PropTypes.string
  }).isRequired,
}

const ItemHeader = styled.div`
  margin-bottom: 0em;
  flex-wrap: wrap;
  font-size: 0.9em;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  @media (min-width: ${props => props.theme.breakpoints.md}) {
    font-size: 1em;
    flex-wrap: nowrap;
  }
  .title {
    color: ${props => props.theme.color.primary};
    margin-bottom: 0.5em;
    margin-right: 1em;
    line-height: 1.5em;
  }
`

const WrapperDivRight = styled.div`
  display: inline-flex;
`

const Item = styled.article`
  margin-bottom: 1.3em;
  a {
    color: inherit;
    text-decoration: none;
    & > div {
      transition: all 0.1s ease;
    }
    &:hover {
      color: inherit;
      text-decoration: none;
      & > div {
        border: 2px solid ${props => props.theme.color.primary};
        box-shadow: 0 2px 3px 0px ${props => props.theme.color.lightgray};
      }
    }
  }
`
