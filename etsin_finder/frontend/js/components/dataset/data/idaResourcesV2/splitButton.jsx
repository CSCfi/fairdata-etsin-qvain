import styled from 'styled-components'
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons'

import IconButton from '../common/iconButton'

export const SplitButtonContainer = styled.span`
  width: 9em;
  display: flex;
  align-items: stretch;
  & > button:first-child {
    flex-grow: 1;
  }

  ${p =>
    p.split &&
    `
  & > button:first-child {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    margin-right: 1px;
    padding-right: 0.25rem;
  }
  & > button:last-child {
    margin-left: 0;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }
  `}
`

export const MoreButton = styled(IconButton).attrs({
  icon: faEllipsisV,
})`
  width: 1.5em;
  padding: 0.125rem 0.125rem;
`
