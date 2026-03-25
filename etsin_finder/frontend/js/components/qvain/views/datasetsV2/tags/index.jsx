import { useStores } from '@/stores/stores'
import { DATA_CATALOG_IDENTIFIER } from '@/utils/constants'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const State = styled.div`
  display: inline-block;
  border-radius: 20px;
  padding: 0.45rem 1.5rem;
  line-height: 1.25;
`

const Draft = styled(State)`
  background-color: ${p => p.theme.color.tags.brightYellow};
  color: ${p => p.theme.color.tags.yellow};
`

const Changed = styled(State)`
  background-color: ${p => p.theme.color.tags.brightBlue};
  color: ${p => p.theme.color.tags.blue};
`

const Published = styled(State)`
  background-color: ${p => p.theme.color.tags.brightGreen};
  color: ${p => p.theme.color.tags.green};
`

const states = {
  draft: {
    Component: Draft,
    translation: 'qvain.datasets.state.draft',
  },
  published: {
    Component: Published,
    translation: 'qvain.datasets.state.published',
  },
  changed: {
    Component: Changed,
    translation: 'qvain.datasets.state.changed',
  },
}

const getDatasetState = dataset => {
  if (dataset.state === 'published') {
    if (dataset.next_draft) {
      return 'changed'
    }
    return 'published'
  }
  return 'draft'
}

const getPreservationTranslation = dataset => {
  if (dataset.preservation_pas_process_running) {
    return 'qvain.datasets.preservation.processing'
  }
  if (dataset.data_catalog?.identifier === DATA_CATALOG_IDENTIFIER.PAS) {
    return 'qvain.datasets.preservation.label'
  }
  return null
}

export const DatasetStateTag = ({ dataset }) => {
  const {
    Locale: { translate },
  } = useStores()
  const state = getDatasetState(dataset)
  const preservation = getPreservationTranslation(dataset)

  const { Component, translation } = states[state]
  let label = translate(translation)
  if (preservation) {
    label += `, ${translate(preservation)}`
  }
  return <Component>{label}</Component>
}
DatasetStateTag.propTypes = {
  dataset: PropTypes.object.isRequired,
}

export default DatasetStateTag
