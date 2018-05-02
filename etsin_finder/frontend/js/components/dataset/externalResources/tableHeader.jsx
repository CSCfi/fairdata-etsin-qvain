import React from 'react'
import styled from 'styled-components'
import Translate from 'react-translate-component'
import PropTypes from 'prop-types'

import { InvertedButton } from '../../general/button'

export default function TableHeader(props) {
  return (
    <div className="downloads-header d-flex justify-content-between">
      <div className="heading-right">
        <TableTitle>
          <Translate content="dataset.dl.files" />
        </TableTitle>
        <ObjectCount>
          <Translate
            component="span"
            content="dataset.dl.fileAmount"
            with={{ amount: props.objectCount }}
          />
        </ObjectCount>
      </div>
      <div className="heading-left d-flex align-items-center">
        <InvertedButton color="white" disabled={!props.access}>
          <Translate content="dataset.dl.downloadAll" />
          <Translate className="screen-reader-only" content="dataset.dl.file_types.both" />
        </InvertedButton>
      </div>
    </div>
  )
}

const TableTitle = styled.h4`
  margin-bottom: 0;
`

const ObjectCount = styled.p`
  margin-bottom: 0;
`

TableHeader.propTypes = {
  objectCount: PropTypes.number.isRequired,
  access: PropTypes.bool.isRequired,
}
