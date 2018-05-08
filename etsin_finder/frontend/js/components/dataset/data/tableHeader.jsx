import React from 'react'
import styled from 'styled-components'
import Translate from 'react-translate-component'
import PropTypes from 'prop-types'

import sizeParse from '../../../utils/sizeParse'
import { InvertedButton } from '../../general/button'

export default function TableHeader(props) {
  return (
    <Header className="d-flex justify-content-between">
      <div>
        <TableTitle>
          <Translate content={`dataset.dl.${props.title}`} />
        </TableTitle>
        <ObjectCount>
          <Translate
            component="span"
            content="dataset.dl.fileAmount"
            with={{ amount: props.objectCount }}
          />
          {props.totalSize !== 0 && ` (${sizeParse(props.totalSize, 1)})`}
        </ObjectCount>
      </div>
      {props.downloadAll && (
        <div className="d-flex align-items-center">
          <InvertedButton color="white" disabled={!props.access}>
            <Translate content="dataset.dl.downloadAll" />
            <Translate className="sr-only" content="dataset.dl.file_types.both" />
          </InvertedButton>
        </div>
      )}
    </Header>
  )
}

const Header = styled.div`
  background-color: ${p => p.theme.color.primary};
  padding: 1em 1.5em;
  color: white;
`

const TableTitle = styled.h4`
  margin-bottom: 0;
`

const ObjectCount = styled.p`
  margin-bottom: 0;
`

TableHeader.defaultProps = {
  totalSize: 0,
}

TableHeader.propTypes = {
  title: PropTypes.string.isRequired,
  totalSize: PropTypes.number,
  objectCount: PropTypes.number.isRequired,
  access: PropTypes.bool.isRequired,
}
