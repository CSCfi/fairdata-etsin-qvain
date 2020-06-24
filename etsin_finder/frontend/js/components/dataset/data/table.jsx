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
import Translate from 'react-translate-component'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { faExclamation } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import TableItem from './tableItem'

const itemMaxAmt = 500

const Table = props => {
  // prints files to dom as list items
  const tableItems = (data) =>
    /* eslint-disable react/no-array-index-key */
    data.map((single, i) => (
      <TableItem
        key={`dataitem-${single.identifier}-${single.name}`}
        item={single}
        index={i}
        changeFolder={props.changeFolder}
        allowInfo={props.allowInfo}
        allowDownload={props.allowDownload}
        fields={props.fields}
        isRemote={props.isRemote}
        cr_id={props.cr_id}
      />
  ))

  const sliced = props.data.length > itemMaxAmt
  const data = sliced ? props.data.slice(0, itemMaxAmt) : props.data
  return (
    <TableContainer>
      <StyledTable>
        <THead>
          <tr>
            <Icon scope="col">
              <Translate content="dataset.dl.type" className="sr-only" />
            </Icon>
            {props.fields.name && (
              <Name scope="col">
                <Translate content="dataset.dl.name" />
              </Name>
            )}
            {props.fields.size && (
              <Size scope="col">
                <Translate content="dataset.dl.size" />
              </Size>
            )}
            {props.fields.category && (
              <Category scope="col">
                <Translate content="dataset.dl.category" />
              </Category>
            )}
            {(props.fields.downloadBtn || props.fields.infoBtn) && (
              <Buttons scope="col">
                <Translate content="dataset.dl.info" className="sr-only" />
              </Buttons>
            )}
          </tr>
        </THead>
        <TBody>
          {sliced && (
            <tr>
              <SlicedInfo colSpan="5">
                <FontAwesomeIcon icon={faExclamation} />
                {' '}
                <Translate content="dataset.dl.sliced" />
              </SlicedInfo>
            </tr>
          )}
          {tableItems(data)}
        </TBody>
      </StyledTable>
    </TableContainer>
  )
  }


Table.defaultProps = {
  changeFolder: () => {},
}

Table.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
  changeFolder: PropTypes.func,
  allowDownload: PropTypes.bool.isRequired,
  allowInfo: PropTypes.bool.isRequired,
  isRemote: PropTypes.bool.isRequired,
  cr_id: PropTypes.string.isRequired,
  fields: PropTypes.shape({
    size: PropTypes.bool.isRequired,
    name: PropTypes.bool.isRequired,
    category: PropTypes.bool.isRequired,
    downloadBtn: PropTypes.bool.isRequired,
    infoBtn: PropTypes.bool.isRequired,
  }).isRequired,
}

export default Table

const Category = styled.th`
  display: none;
  @media (min-width: ${p => p.theme.breakpoints.sm}) {
    display: table-cell;
  }
`

const Icon = styled.th``

const Size = styled.th``

const Name = styled.th``

const Buttons = styled.th``

const SlicedInfo = styled.td`
  text-align: center;
  padding: 12px;
  color: red;
`

const THead = styled.thead`
  background-color: ${p => p.theme.color.darker};
  color: white;
  th {
    border: 0;
    font-weight: 400;
    padding: 12px;
  }
`

const TBody = styled.tbody`
  position: relative;
  border: 2px solid ${p => p.theme.color.lightgray};
  border-top: none;
  color: ${p => p.theme.color.dark};
  font-weight: 300;
`

const StyledTable = styled.table`
  width: 100%;
`

const TableContainer = styled.div`
  width: 100%;
  overflow-x: scroll;
  @media screen and (min-width: ${p => p.theme.breakpoints.sm}) {
    overflow-x: hidden;
  }
`
