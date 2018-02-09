import React from 'react'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import faFolder from '@fortawesome/fontawesome-free-regular/faFolder'
import faFileVideo from '@fortawesome/fontawesome-free-regular/faFileVideo'
import faFile from '@fortawesome/fontawesome-free-regular/faFile'
import faFileAlt from '@fortawesome/fontawesome-free-regular/faFileAlt'
import styled from 'styled-components'

const Tooltip = styled.div`
  display: inline-block;
  position: relative;
  color: inherit;
  background-color: transparent;
  &:before {
    display: none;
    content: "${props => props.title}";
    padding: 3px 8px;
    position: absolute;
    bottom: 100%;
    left: 50%;
    transform: translate(-50%, -4px);
    white-space: nowrap;
    color: white;
    background-color: #181818;
    border-radius: 5px;
  }
  &:after {
    display: none;
    position: absolute;
    bottom: 100%;
    left: 50%;
    transform: translate(-50%, 8px);
    content: ' ';
    border: 6px solid transparent;
    border-top-color: #181818;
  }
  &:hover {
    &:before,
    &:after {
      display: block;
    }
  }
`

const FileIcon = props => {
  if (props.type === 'dir') {
    return <FontAwesomeIcon icon={faFolder} {...props} transform="grow-6" />
  }
  if (props.type === 'Video') {
    return (
      <Tooltip title={props.type}>
        <FontAwesomeIcon icon={faFileVideo} {...props} transform="grow-6" />
      </Tooltip>
    )
  }
  if (props.type === 'Text' || props.ype === 'Teksti') {
    return (
      <Tooltip title={props.type}>
        <FontAwesomeIcon icon={faFileAlt} {...props} transform="grow-6" />
      </Tooltip>
    )
  }
  return (
    <Tooltip title={props.type}>
      <FontAwesomeIcon icon={faFile} {...props} transform="grow-6" />
    </Tooltip>
  )
}

export default FileIcon
