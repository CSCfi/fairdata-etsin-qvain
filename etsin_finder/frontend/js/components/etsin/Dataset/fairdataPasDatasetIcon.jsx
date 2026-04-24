import { observer } from 'mobx-react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import Translate from '@/utils/Translate'

import { DATA_CATALOG_IDENTIFIER } from '@/utils/constants'

const FairdataPasDatasetIcon = ({ preservation, data_catalog_identifier }) => {
  if (
    preservation.pas_process_running &&
    !preservation.pas_package_created &&
    data_catalog_identifier !== DATA_CATALOG_IDENTIFIER.PAS
  ) {
    return (
      <Translate component={FairdataPasIconContainerEnteringPas} content="dataset.enteringPas" />
    )
  }
  return <Translate component={FairdataPasIconContainerInPas} content="dataset.fairdataPas" />
}

export default observer(FairdataPasDatasetIcon)

const FairdataPasIconContainer = styled.div`
  padding: 0.2em 0.9em;
  border-radius: 1em;
  margin-right: 5px;
  display: flex;
  align-items: center;
  white-space: nowrap;
`

const FairdataPasIconContainerInPas = styled(FairdataPasIconContainer)`
  background-color: #b3efb0;
`

const FairdataPasIconContainerEnteringPas = styled(FairdataPasIconContainer)`
  background-color: #efe4b0;
`

FairdataPasDatasetIcon.propTypes = {
  preservation: PropTypes.object.isRequired,
  data_catalog_identifier: PropTypes.string.isRequired,
}
