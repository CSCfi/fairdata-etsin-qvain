import React from 'react'
import styled from 'styled-components'
import Loader from '@/components/general/loader'

export default function Spinner() {
  return (
    <LoadingSplash margin="2rem">
      <Loader active />
    </LoadingSplash>
  )
}

const LoadingSplash = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: ${({ margin = 0 }) => margin};
`
