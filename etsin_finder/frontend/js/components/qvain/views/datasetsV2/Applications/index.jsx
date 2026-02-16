import { observer } from 'mobx-react'

import styled from 'styled-components'
import ApplicationFilters from './ApplicationFilters'
import ApplicationTable from './ApplicationTable'

const Applications = () => {
  return (
    <StyledApplications>
      <ApplicationFilters />
      <ApplicationTable />
    </StyledApplications>
  )
}
export default observer(Applications)

const StyledApplications = styled.div`
  margin: 0.5rem 2rem;
`
