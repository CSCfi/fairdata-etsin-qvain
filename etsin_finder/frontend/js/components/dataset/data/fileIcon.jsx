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
import { TypeConcept } from '../../../utils/propTypes'
import GetLang from '../../general/getLang'

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
  if (props.type !== 'dir' && props.type && props.type.pref_label) {
    return (
      <GetLang
        content={props.type.pref_label}
        render={data => (
          <Tooltip lang={data.lang} title={data.translation}>
            <FontAwesomeIcon
              lang={data.lang}
              icon={Icon(data.translation, props.default)}
              size="2x"
              transform="shrink-4"
              {...props}
            />
          </Tooltip>
        )}
      />
    )
  }
  if (props.type === 'dir') {
    return (
      <FontAwesomeIcon
        icon={Icon('dir', props.default)}
        size="2x"
        transform="shrink-4"
        {...props}
      />
    )
  }
  return (
    <FontAwesomeIcon icon={Icon(false, props.default)} size="2x" transform="shrink-4" {...props} />
  )
}

export default FileIcon

FileIcon.defaultProps = {
  type: undefined,
  default: undefined,
}

FileIcon.propTypes = {
  type: PropTypes.oneOfType([PropTypes.string, TypeConcept]),
  default: PropTypes.string,
}
