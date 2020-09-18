import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

export const Table = styled.table`
  width: 100%;
`

export const TableHeader = styled.thead`
  border-bottom: 1px solid black;
  font-weight: bold;
  padding-bottom: 10px;
  padding-left: 10px;
  padding-right: 10px;
`

export const TableBody = styled.tbody`
  padding-top: 10px;
  padding-bottom: 10px;
  padding-left: 10px;
  padding-right: 10px;
  & > ${Row}:hover {
    ${props => (props.striped ? 'background-color: #e5e5e5;' : '')}
  }
`

export const Row = styled.tr`
  padding: inherit;
`

export const HeaderCell = styled.th`
  padding: inherit;
`

export const BodyCell = styled.td`
  padding: 5px;
  vertical-align: middle;
`

export const TableNoteStyles = styled.tr`
  &:hover {
    background-color: inherit;
  }
`

export const TableNote = props => (
  <TableNoteStyles {...props}>
    <BodyCell>{props.children}</BodyCell>
  </TableNoteStyles>
)

TableNote.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
}

TableNote.defaultProps = {
  children: null,
}
