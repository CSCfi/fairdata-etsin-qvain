import React from 'react'
import Button from '../general/button'

const REMSButton = props => {
  let button
  console.log(props.applicationState)
  switch (props.applicationState) {
    case 'Error':
      button = (
        <Button onClick={props.onClick} color="#cc0000" noMargin>
          Error
        </Button>
      )
      break
    case 'apply':
      button = (
        <Button onClick={props.onClick} noMargin>
          Apply
        </Button>
      )
      break
    case 'draft':
      button = (
        <Button onClick={props.onClick} color="#f9bd39" noMargin>
          Draft
        </Button>
      )
      break
    case 'submitted':
      button = (
        <Button onClick={props.onClick} color="#f9bd39" noMargin>
          Submitted
        </Button>
      )
      break
    case 'approved':
      button = (
        <Button onClick={props.onClick} color="#49a24a" noMargin>
          Approved
        </Button>
      )
      break
    case 'rejected':
      button = (
        <Button onClick={props.onClick} color="#cc0000" noMargin>
          Rejected
        </Button>
      )
      break
    default:
      button = (
        <Button onClick={props.onClick} noMargin>
          Default
        </Button>
      )
      break
  }
  return button
}

export default REMSButton
