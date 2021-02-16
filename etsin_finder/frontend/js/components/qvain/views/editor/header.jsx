import React from 'react'
import Translate from 'react-translate-component'
import { observer } from 'mobx-react'
import PropTypes from 'prop-types'
import { PageTitle } from '../../general/card'
import { useStores } from '../../utils/stores'

const Header = ({ datasetLoading, datasetError }) => {
  const { original } = useStores().Qvain
  const getTitleKey = () => {
    if (datasetLoading) {
      return 'qvain.titleLoading'
    }
    if (datasetError) {
      return 'qvain.titleLoadingFailed'
    }
    if (original) {
      return 'qvain.titleEdit'
    }
    return 'qvain.titleCreate'
  }

  return <Translate component={PageTitle} content={getTitleKey()} />
}

Header.propTypes = {
  datasetLoading: PropTypes.bool.isRequired,
  datasetError: PropTypes.bool.isRequired,
}

export default observer(Header)
