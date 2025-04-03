import React, { useState } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import Translate from 'react-translate-component'
import translate from 'counterpart'

import TooltipClick from './tooltipClick'
import { HelpIcon } from '@/components/general/form'

const CumulativeDatasetInfoText = () => (
  <>
    <Translate component="h3" content="dataset.dl.cumulativeDatasetTooltip.header" />
    <Translate component="p" content="dataset.dl.cumulativeDatasetTooltip.info" />
  </>
)

const DatasetIsCumulativeNotificationBar = props => {
  const [tooltipOpen, setTooltipOpen] = useState(false)

  return (
    <DatasetIsCumulativeContainer>
      <TooltipClick
        isOpen={tooltipOpen}
        close={() => setTooltipOpen(!tooltipOpen)}
        align={props.directionToDisplayTooltip}
        text={<CumulativeDatasetInfoText />}
      >
        <HelpIcon
          aria-label={translate('qvain.rightsAndLicenses.infoTitle')}
          onClick={() => setTooltipOpen(!tooltipOpen)}
        />
      </TooltipClick>
      <Translate content="dataset.dl.cumulativeDatasetLabel" />
    </DatasetIsCumulativeContainer>
  )
}

const DatasetIsCumulativeContainer = styled.div`
  padding: 0.55em 0em 0em 0em;
`

DatasetIsCumulativeNotificationBar.propTypes = {
  directionToDisplayTooltip: PropTypes.string.isRequired,
}

export default DatasetIsCumulativeNotificationBar
