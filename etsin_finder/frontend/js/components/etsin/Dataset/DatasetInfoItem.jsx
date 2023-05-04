import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Translate from 'react-translate-component'
import Stores from '@/stores'
import { hasChildren } from '@/utils/helpers'
import ErrorBoundary from '@/components/general/errorBoundary'

const { Locale } = Stores

const DatasetInfoItem = (props) => 
  hasChildren(props.children) && 
    <ErrorBoundary title={`Error in ${props.itemTitle}`}>
      {props.itemTitle && (
        <DT lang={Locale.currentLang} className="heading4">
          <Translate content={props.itemTitle}/>
        </DT>
      )}
      <DD>{props.children}</DD>
    </ErrorBoundary>

export default DatasetInfoItem

DatasetInfoItem.propTypes = {
  itemTitle: PropTypes.string,
  children: PropTypes.node,
}

DatasetInfoItem.defaultProps = {
  itemTitle: undefined,
  children: undefined,
}

const DT = styled.dt`
  font-size: 1.12em;
  color: black;
  margin-bottom: 0;
  padding: 1rem 1.5rem 0.5rem;
`

const DD = styled.dd`
  color: black;
  padding: 0 1.5rem;

  a {
    color: ${p => p.theme.color.linkColorUIV2};
  }
`
