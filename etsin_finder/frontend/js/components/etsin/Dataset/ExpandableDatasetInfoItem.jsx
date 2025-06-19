import PropTypes from 'prop-types'
import styled from 'styled-components'
import Translate from '@/utils/Translate'
import { hasChildren } from '@/utils/helpers'
import ErrorBoundary from '@/components/general/errorBoundary'
import EtsinTooltip from './EtsinTooltip'
import { useStores } from '@/stores/stores'
import { useState } from 'react'
import { ExpandCollapse } from '@/components/qvain/general/V2/ExpandCollapse'

const ExpandableDatasetInfoItem = props => {
    const { Locale } = useStores()
    const [isExpanded, setIsExpanded] = useState(false)

    const toggleIsExpanded = () => {
        setIsExpanded(isExpanded => !isExpanded)
    }

    return (
        hasChildren(props.children) && (
            <ErrorBoundary title={`Error in ${props.itemTitle}`}>
                {props.itemTitle && (
                    <DT lang={Locale.currentLang} className="heading4">
                        <ExpandCollapse
                            isExpanded={isExpanded}
                            onClick={toggleIsExpanded}
                            data-testid="toggle-show-expandable-dataset-info-item-children" />
                        <Translate content={props.itemTitle} />
                        {props.tooltip ? <EtsinTooltip tooltip={props.tooltip} /> : null}
                        {props.extra}
                    </DT>
                )}
                {/* Show child components only in expanded mode:*/}
                {isExpanded && <DD>{props.children}</DD>}
            </ErrorBoundary>
        )
    )
}

ExpandableDatasetInfoItem.propTypes = {
    itemTitle: PropTypes.string,
    children: PropTypes.node,
    tooltip: PropTypes.object,
    extra: PropTypes.node,
}

ExpandableDatasetInfoItem.defaultProps = {
    itemTitle: undefined,
    children: undefined,
    tooltip: null,
    extra: null,
}

const DT = styled.dt`
  position: relative;
  font-size: 0.9em;
  line-height: 1.1;
  color: black;
  margin-bottom: 0;
  padding: 1.5rem 1.5rem 0rem 1.5rem;
  letter-spacing: 0.02rem;
`

const DD = styled.dd`
  color: black;
  padding: 1rem 1.5rem 0rem 1.5rem;

  a {
    color: ${p => p.theme.color.linkColorUIV2};
  }
`

export default ExpandableDatasetInfoItem
