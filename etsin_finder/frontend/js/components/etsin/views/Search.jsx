import React from 'react'

import FlaggedComponent from '@/components/general/flaggedComponent'
import OldSearch from '@/components/search'
import NewSearch from '@/components/etsin/Search'

function DatasetView(props) {
  return (
    <div>
      <FlaggedComponent flag="ETSIN.UI.V2" whenDisabled={<OldSearch {...props} />}>
        <FlaggedComponent flag="ETSIN.METAX_V3.FRONTEND" whenDisabled={<OldSearch {...props} />}>
          <NewSearch {...props} />
        </FlaggedComponent>
      </FlaggedComponent>
    </div>
  )
}

export default DatasetView
