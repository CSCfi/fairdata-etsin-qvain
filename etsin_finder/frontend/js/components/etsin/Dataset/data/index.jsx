import React, { useEffect } from 'react'
import { observer } from 'mobx-react'
import PropTypes from 'prop-types'

import { useStores } from '@/stores/stores'

import ExternalResources from './externalResources'
import IdaResources from './idaResources'

const Data = ({ id }) => {
  const {
    Matomo: { recordEvent },
    Accessibility,
    Etsin: {
      EtsinDataset: { identifier, hasRemoteResources },
    },
  } = useStores()

  useEffect(() => {
    Accessibility.handleNavigation('data', false)
    recordEvent(`DATA / ${identifier}`)
  }, [Accessibility, recordEvent, identifier])

  return (
    <div className="tabContent" id={id}>
      {!hasRemoteResources && <IdaResources />}
      {hasRemoteResources && <ExternalResources />}
    </div>
  )
}

Data.propTypes = {
  id: PropTypes.string.isRequired,
}

export default observer(Data)
