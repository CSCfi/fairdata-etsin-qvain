import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import {
  faFile,
  faExternalLinkAlt,
  faDownload,
  faInfoCircle,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { observer } from 'mobx-react'
import Translate from '@/utils/Translate'

import { useStores } from '@/stores/stores'
import IconButton from '../common/iconButton'

const ResourceItem = ({ resource, hideAccess }) => {
  const {
    Locale: { getValueTranslation },
    Etsin: {
      EtsinDataset: { setInInfo },
    },
  } = useStores()

  return (
    <Item>
      <Name title={getValueTranslation(resource.title)}>
        <ResourceIcon resource={resource} />
        {getValueTranslation(resource.title)}
      </Name>

      <InfoColumn>
        <Translate
          component={InfoButton}
          fontSize="11pt"
          content="dataset.dl.info"
          onClick={() => setInInfo(resource)}
          attributes={{
            'aria-label': `dataset.dl.infoModalButton.external`,
          }}
        />
      </InfoColumn>

      {resource.access_url && !hideAccess && (
        <LinkButtonColumn>
          <Translate
            component={LinkButton}
            content="dataset.dl.source"
            href={resource.access_url}
          />
        </LinkButtonColumn>
      )}

      {resource.download_url && (
        <DownloadButtonColumn>
          <Translate
            component={DownloadButton}
            content="dataset.dl.download"
            href={resource.download_url}
          />
        </DownloadButtonColumn>
      )}
    </Item>
  )
}

ResourceItem.propTypes = {
  resource: PropTypes.object.isRequired,
  hideAccess: PropTypes.bool,
}

ResourceItem.defaultProps = {
  hideAccess: false,
}

export const Name = styled.span`
  grid-column: 1/2;
  white-space: nowrap;
  text-overflow: ellipsis;
  display: block;
  overflow: hidden;
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

const InfoButton = styled(ResourceButton).attrs({
  flexGrow: 1,
  icon: faInfoCircle,
  invert: true,
  color: 'darkgray',
})``

const InfoColumn = styled.div`
  grid-column: info-start/info-end;
  display: flex;
  align-self: stretch;
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
