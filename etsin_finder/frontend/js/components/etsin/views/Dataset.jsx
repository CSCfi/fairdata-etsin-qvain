import React from 'react'

import FlaggedComponent from '@/components/general/flaggedComponent'
import OldDataset from '@/components/dataset'
import NewDataset from '@/components/etsin/Dataset'

function DatasetView(props) {
    return <div>
        <FlaggedComponent flag="ETSIN.UI.V2" whenDisabled={<OldDataset {...props} />}>
            <NewDataset {...props} />
        </FlaggedComponent></div>
}

export default DatasetView
