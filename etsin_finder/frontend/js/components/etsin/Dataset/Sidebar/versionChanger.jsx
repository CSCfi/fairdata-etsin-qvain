import React, { useState } from 'react'
import { observer } from 'mobx-react'
import Select from 'react-select'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import Translate from '@/utils/Translate'
import { useStores } from '@/utils/stores'
import versionChangerStyles from './versionChangerStyles'

const VersionChanger = props => {
  const {
    Etsin: {
      EtsinDataset: { identifier, datasetVersions, hasExistingVersion },
    },
  } = useStores()

  const versions = datasetVersions?.map((single, i) => {
    const old = i > 0
    return {
      label: (
        <>
          <Translate content={'dataset.version.number'} with={{ number: single.version }} />
          {old ? (
            <>
              <span> </span>
              <Translate content={'dataset.version.old'} />
            </>
          ) : (
            ''
          )}
        </>
      ),
      value: single.id,
      removed: single.removed,
      old,
    }
  })

  const [selected, setSelected] = useState(
    versions?.filter(single => single.value === identifier)[0]
  )

  const changeVersion = value => {
    setSelected(value)
    props.history.push(`/dataset/${value.value}`)
  }

  return (
    hasExistingVersion && (
      <>
        <Translate component="label" content="dataset.version.label" className="sr-only" />
        <Select
          id="versionChanger"
          styles={versionChangerStyles(selected)}
          value={selected}
          onChange={value => changeVersion(value)}
          options={versions.filter(single => !single.removed)}
          isClearable={false}
          isSearchable={false}
        />
      </>
    )
  )
}

VersionChanger.propTypes = {
  history: PropTypes.object.isRequired,
}

export default withRouter(observer(VersionChanger))
