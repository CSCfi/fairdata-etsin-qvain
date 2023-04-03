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

import React, { useState } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import Translate from 'react-translate-component'
import translate from 'counterpart'

import TooltipClick from './tooltipClick'
import { HelpIcon } from '../../general/form'
import CumulativeDatasetInfo from './cumulativeDatasetInfoText'

const DatasetIsCumulativeNotificationBar = props => {
  const [tooltipOpen, setTooltipOpen] = useState(false)

  return (
    <DatasetIsCumulativeContainer>
      <TooltipClick
        isOpen={tooltipOpen}
        close={() => setTooltipOpen(!tooltipOpen)}
        align={props.directionToDisplayTooltip}
        text={<CumulativeDatasetInfo />}
      >
        <HelpIcon
          aria-label={translate('qvain.rightsAndLicenses.infoTitle')}
          onClick={() => setTooltipOpen(!tooltipOpen)}
        />
      </TooltipClick>
      <Translate
        content="dataset.dl.cumulativeDatasetLabel"
      />
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
