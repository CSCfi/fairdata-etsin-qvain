import React from 'react'

import FlaggedComponent from '../general/flaggedComponent'
import FrontPageV2 from './frontpage'
import FrontPageV3 from '@/components/etsin/views/FrontPage'

const FrontPage = () => (
  <FlaggedComponent whenDisabled={<FrontPageV2 />} flag="ETSIN.METAX_V3.FRONTEND">
    <FrontPageV3 />
  </FlaggedComponent>
)

export default FrontPage
