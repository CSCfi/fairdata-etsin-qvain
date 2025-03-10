/**
 * This file is part of the Etsin service
 *
 * Copyright 2017-2021 Ministry of Education and Culture, Finland
 *
 *
 * @author    CSC - IT Center for Science Ltd., Espoo Finland <servicedesk@csc.fi>
 * @license   MIT
 */
import styled from 'styled-components'

export const Table = styled.table`
  overflow-x: scroll;
  width: 100%;
  max-width: 100%;
  margin-bottom: 1rem;
  background-color: transparent;
  thead {
    background-color: ${props => props.theme.color.primary};
    color: white;
    tr > th {
      padding: 0.75rem;
      border: 0;
    }
  }
  tbody {
    box-sizing: border-box;
    border: 2px solid ${props => props.theme.color.lightgray};
    border-top: ${props => (props.noHead ? '' : 0)};
    tr:nth-child(odd) {
      background-color: ${props => props.theme.color.superlightgray};
    }
    tr:nth-child(even) {
      background-color: ${props => props.theme.color.white};
    }
    td {
      overflow-wrap: break-word;
      padding: 0.75rem;
      vertical-align: middle;
      a {
        color: ${props => props.theme.color.linkColorUIV2};
      }
    }
  }
`

export const ID = styled.span`
  margin-left: 0.2em;
  color: ${props => props.theme.color.darkgray};
  font-size: 0.9em;
`

export const IDLink = styled.a`
  margin-left: 0.2em;
  font-size: 0.9em;
  color: ${p => p.theme.color.linkColorUIV2};
`

export const OtherID = styled.li`
  margin: 0;
  > a {
    color: ${p => p.theme.color.linkColorUIV2};
  }
`

export const Margin = styled.section`
  margin: 1.5em 0em;
`

export const InlineUl = styled.ul`
  display: inline;
  margin: 0;
  padding: 0;
`
