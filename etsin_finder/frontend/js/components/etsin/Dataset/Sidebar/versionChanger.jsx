import React, { useState } from 'react'
import { observer } from 'mobx-react'
import Select from 'react-select'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import Translate from 'react-translate-component'
import { useStores } from '@/utils/stores'
import versionChangerStyles from './versionChangerStyles'

const VersionChanger = props => {
  const {
    Etsin: {
      EtsinDataset: { identifier, datasetVersions, hasExistingVersion },
    },
  } = useStores()

  const versions = versionLabels(datasetVersions)

  const [selected, setSelected] = useState(
    versions.filter(single => single.value === identifier)[0]
  )

  function versionLabels(versionSet) {
    const labels = versionSet.map((single, i) => {
      const old = i > 0
      return {
        label: (
          <>
            <Translate
              content={'dataset.version.number'}
              with={{ number: versionSet.length - i }}
            />
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
        value: single.identifier,
        removed: single.removed,
        old,
      }
    })
    return labels
  }

  const changeVersion = value => {
    setSelected(value)
    props.history.push(`/dataset/${value.value}`)
  }

  return (
    hasExistingVersion && (
      <>
        <Translate content="dataset.version.label" className="sr-only" />
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
