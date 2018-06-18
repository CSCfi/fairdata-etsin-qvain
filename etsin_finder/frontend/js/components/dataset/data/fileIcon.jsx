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

import React from 'react'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import faFolder from '@fortawesome/fontawesome-free-regular/faFolder'
import faFileVideo from '@fortawesome/fontawesome-free-regular/faFileVideo'
import faFileImage from '@fortawesome/fontawesome-free-regular/faFileImage'
import faFile from '@fortawesome/fontawesome-free-regular/faFile'
import faFileAlt from '@fortawesome/fontawesome-free-regular/faFileAlt'
import faCloud from '@fortawesome/fontawesome-free-solid/faCloud'
import PropTypes from 'prop-types'

import Tooltip from '../../general/tooltip'

const Icon = (type, def) => {
  if (!type) {
    if (def === 'cloud') {
      return faCloud
    }
    return faFile
  }
  if (type === 'dir') {
    return faFolder
  }
  if (type === 'Video') {
    return faFileVideo
  }
  if (type === 'Kuva' || type === 'Image') {
    return faFileImage
  }
  if (type === 'Text' || type === 'Teksti') {
    return faFileAlt
  }
  return faFile
}

const FileIcon = props => {
  if (props.type !== 'dir' && props.type) {
    return (
      <Tooltip title={props.type}>
        <FontAwesomeIcon
          icon={Icon(props.type, props.default)}
          size="2x"
          transform="shrink-4"
          {...props}
        />
      </Tooltip>
    )
  }
  return (
    <FontAwesomeIcon
      icon={Icon(props.type, props.default)}
      size="2x"
      transform="shrink-4"
      {...props}
    />
  )
}

export default FileIcon

FileIcon.defaultProps = {
  type: undefined,
  default: undefined,
}

FileIcon.propTypes = {
  type: PropTypes.string,
  default: PropTypes.string,
}
