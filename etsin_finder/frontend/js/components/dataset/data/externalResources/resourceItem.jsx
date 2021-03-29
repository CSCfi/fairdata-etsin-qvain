import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import Translate from 'react-translate-component'
import { faFile, faExternalLinkAlt, faDownload } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { observer } from 'mobx-react'

import { useStores } from '../../../../stores/stores'
import IconButton from '../common/iconButton'

const ResourceItem = ({ resource }) => {
  const {
    Locale: { getValueTranslation },
  } = useStores()

  return (
    <Item>
      <Name title={getValueTranslation(resource.title)}>
        <ResourceIcon resource={resource} />
        {getValueTranslation(resource.title)}
      </Name>
      <Category>{getValueTranslation(resource.use_category?.pref_label)}</Category>

      {resource.access_url && (
        <LinkButtonColumn>
          <Translate
            component={LinkButton}
            content="dataset.dl.source"
            href={resource.access_url.identifier}
          />
        </LinkButtonColumn>
      )}

      {resource.download_url && (
        <DownloadButtonColumn>
          <Translate
            component={DownloadButton}
            content="dataset.dl.download"
            href={resource.download_url.identifier}
          />
        </DownloadButtonColumn>
      )}
    </Item>
  )
}

ResourceItem.propTypes = {
  resource: PropTypes.object.isRequired,
}

export const Name = styled.span`
  grid-column: 1/2;
  white-space: nowrap;
  text-overflow: ellipsis;
  display: block;
  overflow: hidden;
`

export const Category = styled.div`
  grid-column: 2/3;
  width: max-content;

  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    display: none;
  }
`

const ResourceIcon = styled(FontAwesomeIcon).attrs({
  icon: faFile,
})`
  margin-right: 0.5em;
`

const ResourceButton = styled(IconButton)`
  width: 100%;
  height: 100%;
  margin-left: 0;
  margin-right: 0;
  margin: 0;
`

export const LinkButton = styled(ResourceButton).attrs({
  flexGrow: 1,
  icon: faExternalLinkAlt,
  color: 'darkgray',
  invert: true,
  link: true,
})``

const LinkButtonColumn = styled.div`
  grid-column: access-start/access-end;
  display: flex;
  align-self: stretch;
`

export const DownloadButton = styled(ResourceButton).attrs({
  flexGrow: 1,
  icon: faDownload,
  color: 'success',
  link: true,
})``

const DownloadButtonColumn = styled.div`
  grid-column: download-start/download-end;
  display: flex;
  align-self: stretch;
`

const Item = styled.li`
  display: contents;
`

export default observer(ResourceItem)
