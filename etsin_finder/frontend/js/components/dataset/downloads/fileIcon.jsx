import React from 'react'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import faFolder from '@fortawesome/fontawesome-free-regular/faFolder'
import faFileVideo from '@fortawesome/fontawesome-free-regular/faFileVideo'
import faFile from '@fortawesome/fontawesome-free-regular/faFile'
import faFileAlt from '@fortawesome/fontawesome-free-regular/faFileAlt'
import Tooltip from '../../general/tooltip'

const FileIcon = props => {
  if (props.type === 'dir') {
    return <FontAwesomeIcon icon={faFolder} size="2x" transform="shrink-4" {...props} />
  }
  if (props.type === 'Video') {
    return (
      <Tooltip title={props.type}>
        <FontAwesomeIcon icon={faFileVideo} size="2x" transform="shrink-4" {...props} />
      </Tooltip>
    )
  }
  if (props.type === 'Text' || props.type === 'Teksti') {
    return (
      <Tooltip title={props.type}>
        <FontAwesomeIcon icon={faFileAlt} size="2x" transform="shrink-4" {...props} />
      </Tooltip>
    )
  }
  if (props.type) {
    return (
      <Tooltip title={props.type}>
        <FontAwesomeIcon icon={faFile} size="2x" transform="shrink-4" {...props} />
      </Tooltip>
    )
  }
  return <FontAwesomeIcon icon={faFile} size="2x" transform="shrink-4" {...props} />
}

export default FileIcon
