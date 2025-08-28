import { Link } from 'react-router'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { DATA_CATALOG_IDENTIFIER, ACCESS_TYPE_URL } from '@/utils/constants'
import ErrorBoundary from '@/components/general/errorBoundary'
import ContentBox from '@/components/general/contentBox'
import FairdataPasDatasetIcon from '@/components/etsin/Dataset/fairdataPasDatasetIcon'
import { useStores } from '@/stores/stores'

import AccessRights from './accessRights'

const SearchListItem = ({ item }) => {
  const {
    Locale: { getValueTranslation, getPreferredLang },
  } = useStores()

  const datasetAvailability = () => {
    const accessRights = item.access_rights
    if (!accessRights) return null

    const url = item.access_rights.access_type.url
    const id = Object.keys(ACCESS_TYPE_URL).find(key => ACCESS_TYPE_URL[key] === url)
    return `dataset.access_rights_description.${id?.toLowerCase() || ''}`
  }

  const shortenDescription = () => {
    const description = getValueTranslation(item.description)
    if (!description) return null
    if (description.length < 500) return description
    const trimmed = description.substring(0, 499)
    return `${trimmed.substr(0, Math.min(trimmed.length, trimmed.lastIndexOf(' ')))}...`
  }

  const title = getValueTranslation(item.title)
  const lang = getPreferredLang(item.title)

  return (
    <Item>
      <ErrorBoundary>
        <Link
          to={`/dataset/${item.id}`}
          aria-label={`
              ${title}:
              ${datasetAvailability()}:
              ${shortenDescription()}`}
          lang={lang}
        >
          <ContentBox>
            <ErrorBoundary>
              <ItemHeader>
                <h2 className="title" lang={lang}>
                  {title}
                </h2>
                <WrapperDivRight>
                  {(item.data_catalog === DATA_CATALOG_IDENTIFIER.PAS ||
                    item.preservation_state === 80) && (
                    <FairdataPasDatasetIcon
                      preservation_state={item.preservation_state}
                      data_catalog_identifier={item.data_catalog}
                    />
                  )}
                  <AccessRights accessRights={item.access_rights} />
                </WrapperDivRight>
              </ItemHeader>
            </ErrorBoundary>
            <ErrorBoundary>
              {Array.isArray(item.field_of_science) && (
                <BasicInfo className="basic-info">
                  {item.field_of_science.map(field => (
                    <div key={field.url} lang={lang}>
                      {getValueTranslation(field.pref_label)}
                    </div>
                  ))}
                </BasicInfo>
              )}
            </ErrorBoundary>
            <ErrorBoundary>
              <p lang={lang}>{shortenDescription()}</p>
            </ErrorBoundary>
          </ContentBox>
        </Link>
      </ErrorBoundary>
    </Item>
  )
}

SearchListItem.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.object.isRequired,
    access_rights: PropTypes.object,
    preservation_state: PropTypes.number,
    field_of_science: PropTypes.array,
    description: PropTypes.object,
    data_catalog: PropTypes.string,
  }).isRequired,
}

const BasicInfo = styled.div`
  margin-bottom: 1rem;
`

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

export default SearchListItem
