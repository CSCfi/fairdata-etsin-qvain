import React from 'react'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import faFolder from '@fortawesome/fontawesome-free-regular/faFolder'
import faFileVideo from '@fortawesome/fontawesome-free-regular/faFileVideo'
import faFile from '@fortawesome/fontawesome-free-regular/faFile'
import faFileAlt from '@fortawesome/fontawesome-free-regular/faFileAlt'

const FileIcon = props => {
  console.log(props.type)
  if (props.type === 'dir') {
    return <FontAwesomeIcon icon={faFolder} {...props} transform="grow-6" />
  }
  if (props.type === 'Video') {
    return <FontAwesomeIcon icon={faFileVideo} {...props} transform="grow-6" />
  }
  if (props.type === 'Text' || props.ype === 'Teksti') {
    return <FontAwesomeIcon icon={faFileAlt} {...props} transform="grow-6" />
  }
  return <FontAwesomeIcon icon={faFile} {...props} transform="grow-6" />
}

export default FileIcon
