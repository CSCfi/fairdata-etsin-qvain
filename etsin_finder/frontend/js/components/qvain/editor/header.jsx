import React from 'react'
import Translate from 'react-translate-component'
import { observer, inject } from 'mobx-react'
import PropTypes from 'prop-types'
import Title from '../general/title'
import { SubHeader, SubHeaderText } from '../general/card'
import { SubHeaderTextContainer } from './styledComponents'

const Header = ({ Stores, datasetLoading, datasetError }) => {
  const getTitleKey = () => {
    const { original } = Stores.Qvain
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

  return (
    <SubHeader>
      <SubHeaderTextContainer>
        <SubHeaderText>
          <Translate component={Title} content={getTitleKey()} />
        </SubHeaderText>
      </SubHeaderTextContainer>
    </SubHeader>
  )
}

Header.propTypes = {
  Stores: PropTypes.object.isRequired,
  datasetLoading: PropTypes.bool.isRequired,
  datasetError: PropTypes.bool.isRequired,
}

export default inject('Stores')(observer(Header))
