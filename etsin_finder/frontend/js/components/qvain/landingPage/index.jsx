import React from 'react'
import styled from 'styled-components'
import Description from './description'
import Graphics from './graphics'

const landingPage = () => (
  <div className="container">
    <Flex>
      <Part>
        <Description />
      </Part>
      <Part>
        <Graphics />
      </Part>
    </Flex>
  </div>
)

const Part = styled.div``

const Flex = styled.div`
  margin: 5.25rem -0.75rem 1.25rem 0.25rem;
  display: flex;

  > * {
    width: calc(50% - 0.75rem);
    flex-grow: 1;
    margin: 0.75rem;
  }

  @media screen and (max-width: ${p => p.theme.breakpoints.lg}) {
    margin-top: 1.25rem;
    flex-wrap: wrap;
    > * {
      width: 100%;
    }
  }
`

export default landingPage
