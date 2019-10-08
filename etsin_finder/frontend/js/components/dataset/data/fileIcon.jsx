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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faFolder,
  faFileVideo,
  faFileImage,
  faFile,
  faFileAlt,
} from '@fortawesome/free-regular-svg-icons'
import { faCloud } from '@fortawesome/free-solid-svg-icons'
import PropTypes from 'prop-types'
import translate from 'counterpart'

import TooltipHover from '../../general/tooltipHover'
import { TypeConcept } from '../../../utils/propTypes'
import checkDataLang, { getDataLang } from '../../../utils/checkDataLang'

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
      <React.Fragment>
        <div className="sr-only" lang={getDataLang(props.type.pref_label)}>
          {checkDataLang(props.type.pref_label)}
        </div>
        <TooltipHover
          title={checkDataLang(props.type.pref_label)}
          lang={getDataLang(props.type.pref_label)}
        >
          <FontAwesomeIcon
            icon={Icon(checkDataLang(props.type.pref_label), props.default)}
            size="2x"
            transform="shrink-4"
            {...props}
            lang={getDataLang(props.type.pref_label)}
            title={checkDataLang(props.type.pref_label)}
          />
        </TooltipHover>
      </React.Fragment>
    )
  }
  if (props.type === 'dir') {
    return (
      <React.Fragment>
        <div className="sr-only">{translate('dataset.dl.file_types.directory')}</div>
        <FontAwesomeIcon
          icon={Icon('dir', props.default)}
          size="2x"
          transform="shrink-4"
          {...props}
        />
      </React.Fragment>
    )
  }
  return (
    <React.Fragment>
      <div className="sr-only">{translate('dataset.dl.file_types.file')}</div>
      <FontAwesomeIcon
        icon={Icon(false, props.default)}
        size="2x"
        transform="shrink-4"
        {...props}
      />
    </React.Fragment>
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
