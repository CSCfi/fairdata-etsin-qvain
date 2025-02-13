import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Translate from '@/utils/Translate'

import { hasChildren } from '@/utils/helpers'
import ErrorBoundary from '@/components/general/errorBoundary'

import EtsinTooltip from './EtsinTooltip'
import { useStores } from '@/stores/stores'

const DatasetInfoItem = props => {
  const { Locale } = useStores()

  return (
    hasChildren(props.children) && (
      <ErrorBoundary title={`Error in ${props.itemTitle}`}>
        {props.itemTitle && (
          <DT lang={Locale.currentLang} className="heading4">
            <Translate content={props.itemTitle} />
            {props.tooltip ? <EtsinTooltip tooltip={props.tooltip} /> : null}
            {props.extra}
          </DT>
        )}
        <DD>{props.children}</DD>
      </ErrorBoundary>
    )
  )
}

DatasetInfoItem.propTypes = {
  itemTitle: PropTypes.string,
  children: PropTypes.node,
  tooltip: PropTypes.object,
  extra: PropTypes.node,
}

DatasetInfoItem.defaultProps = {
  itemTitle: undefined,
  children: undefined,
  tooltip: null,
  extra: null,
}

const DT = styled.dt`
  position: relative;
  font-size: 1.12em;
  line-height: 1.1;
  color: black;
  margin-bottom: 0;
  padding: 1rem 1.5rem;
`

const DD = styled.dd`
  color: black;
  padding: 0 1.5rem;

  a {
    color: ${p => p.theme.color.linkColorUIV2};
  }
`
export default DatasetInfoItem
