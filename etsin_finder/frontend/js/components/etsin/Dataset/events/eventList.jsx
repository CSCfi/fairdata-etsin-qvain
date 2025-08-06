import { observer } from 'mobx-react'
import styled from 'styled-components'
import Translate from '@/utils/Translate'

import { useStores } from '@/stores/stores'
import { Margin } from './common'
import UserEnteredEvents from './UserEnteredEvents'
import ServiceGeneratedEvents from './ServiceGeneratedEvents'

const EventList = () => {
  const {
    Etsin: {
      EtsinDataset: {
        hasEvents
      },
    },
  } = useStores()

  //If the dataset has events, the Events table is displayed:
  if (hasEvents) {
    return (
      <Margin>
        <h2>
          <Translate content="dataset.events_idn.events.title" />
        </h2>
        <Table>
          <thead>
            <tr>
              <th className="rowIcon" scope="col">
                <Translate content="dataset.events_idn.events.description" />
              </th>
              <th className="rowIcon" scope="col">
                <Translate content="dataset.events_idn.events.event" />
              </th>
              <th className="rowIcon" scope="col">
                <Translate content="dataset.events_idn.events.who" />
              </th>
              <th className="rowIcon" scope="col">
                {' '}
                <Translate content="dataset.events_idn.events.when" />
              </th>
              <th className="rowIcon" scope="col">
                <Translate content="dataset.events_idn.events.where" />
              </th>
            </tr>
          </thead>
          <tbody>
            {/*If the dataset has user-based events, they are rendered as table 
            rows with an associated subheading: */}
            <UserEnteredEvents />
            {/*If the dataset has service-generated events, they are rendered 
            as table rows with an associated subheading: */}
            <ServiceGeneratedEvents />
          </tbody>
        </Table>
      </Margin>
    )
  }

  //Otherwise, the Events table isn't displayed:
  return null
}

const Table = styled.table`
  overflow-x: scroll;
  width: 100%;
  max-width: 100%;
  margin-bottom: 1rem;
  background-color: transparent;
  thead {
    background-color: ${props => props.theme.color.primary};
    color: white;
    tr > th {
      padding: 0.75rem;
      border: 0;
    }
  }
  tbody {
    box-sizing: border-box;
    border: 2px solid ${props => props.theme.color.lightgray};
    border-top: ${props => (props.noHead ? '' : 0)};
    background-color: ${props => props.theme.color.white};
    tr {
      border-top: 1px solid ${props => props.theme.color.lightgray};
    }
    tr:first-child {
      border-top: none;
    }
    td {
      overflow-wrap: break-word;
      padding: 0.75rem;
      vertical-align: middle;
      a {
        color: ${props => props.theme.color.linkColorUIV2};
      }
    }
  }
`

export default observer(EventList)
