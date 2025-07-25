import { observer } from 'mobx-react'
import PropTypes from 'prop-types'
import Translate from '@/utils/Translate'
import { PageTitle } from '../../general/card'
import { useStores } from '../../utils/stores'
import queryParam from '@/utils/queryParam'

const Header = ({ datasetLoading, datasetError }) => {
  const {
    Qvain: {
      original,
      isNewVersion
    },
    Env: {
      history: {
        location
      }
    }
  } = useStores()

  const getTitleKey = () => {
    const templateIdentifier = queryParam(location, 'template')

    if (datasetLoading) {
      return 'qvain.titleLoading'
    }
    if (datasetError) {
      return 'qvain.titleLoadingFailed'
    }
    /*If a dataset has a template identifier, it uses an existing dataset 
    as a model: */
    if (templateIdentifier) {
      return 'qvain.titleModelBasedDataset'
    }
    /*If a new version of an existing dataset is created, the condition 
    below is implemented. The condition must come before the condition that 
    is reflected to the value of original, since the new version also has 
    original: */
    if (isNewVersion) {
      return 'qvain.titleNewVersion'
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
