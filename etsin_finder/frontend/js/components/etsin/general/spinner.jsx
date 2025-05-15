import React from 'react'
import styled from 'styled-components'
import Loader from '@/components/general/loader'
import withCustomProps from '@/utils/withCustomProps'

export default function Spinner() {
  return (
    <LoadingSplash margin="2rem">
      <Loader active />
    </LoadingSplash>
  )
}

const LoadingSplash = withCustomProps(styled.div)`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: ${({ margin = 0 }) => margin};
`
