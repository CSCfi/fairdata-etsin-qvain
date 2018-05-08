import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import checkDataLang from '../../../utils/checkDataLang'
import ErrorBoundary from '../../general/errorBoundary'
import AccessRights from '../../dataset/accessRights'
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
          <Link to={`/dataset/${this.props.catId}`}>
            <ContentBox>
              <ErrorBoundary>
                <div className="d-flex justify-content-between align-items-start item-header">
                  <h2 className="title">{checkDataLang(this.props.item.title, this.props.lang)}</h2>
                  <AccessRights
                    access_rights={this.props.item.access_rights}
                    style={{ marginBottom: '1em' }}
                  />
                </div>
              </ErrorBoundary>
              <ErrorBoundary>
                {Array.isArray(this.props.item.field_of_science) && (
                  <div className="basic-info">
                    <p>
                      {this.props.item.field_of_science.map(field =>
                        checkDataLang(field.pref_label)
                      )}
                    </p>
                  </div>
                )}
              </ErrorBoundary>
              <ErrorBoundary>
                <p>
                  {this.shortDescription(
                    this.props.item.description.map(description =>
                      checkDataLang(description, this.props.lang)
                    )[0]
                  )}
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
    field_of_science: PropTypes.array,
    description: PropTypes.object.isRequired,
  }).isRequired,
  lang: PropTypes.string.isRequired,
}

const Item = styled.div`
  margin-bottom: 1.3em;
  a {
    color: inherit;
    text-decoration: none;
    & > div {
      transition: all 0.1s ease;
    }
    &:hover {
      & > div {
        border: 2px solid ${props => props.theme.color.primary};
        box-shadow: 0 2px 3px 0px ${props => props.theme.color.lightgray};
      }
    }
    .title {
      color: ${props => props.theme.color.primary};
      margin-bottom: 0.5em;
      margin-right: 1em;
      line-height: 1.5em;
    }
  }
  .item-header {
    margin-bottom: 0em;
    flex-wrap: wrap;
    font-size: 0.9em;
    @media (min-width: ${props => props.theme.breakpoints.md}) {
      font-size: 1em;
      flex-wrap: nowrap;
    }
  }
`
