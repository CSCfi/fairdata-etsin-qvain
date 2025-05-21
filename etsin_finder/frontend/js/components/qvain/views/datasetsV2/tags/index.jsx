import PropTypes from 'prop-types'
import styled from 'styled-components'
import Translate from '@/utils/Translate'

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

const cells = {
  draft: {
    component: Draft,
    translation: 'qvain.datasets.state.draft',
  },
  published: {
    component: Published,
    translation: 'qvain.datasets.state.published',
  },
  changed: {
    component: Changed,
    translation: 'qvain.datasets.state.changed',
  },
}

export const DatasetStateTag = ({ state }) => {
  const cell = cells[state]
  return <Translate component={cell.component} content={cell.translation} />
}

DatasetStateTag.propTypes = {
  state: PropTypes.string.isRequired,
}

export default DatasetStateTag
