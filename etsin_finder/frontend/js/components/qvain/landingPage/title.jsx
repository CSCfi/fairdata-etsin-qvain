import React from 'react'
import styled from 'styled-components'
import Translate from 'react-translate-component'

const Title = () => (
  <>
    <Header>Qvain</Header>
    <Translate component={Brief} content={'qvain.general.brief'} />
  </>
)

const Header = styled.h1`
  font-weight: 300;
  line-height: 1.2;
  font-size: 4.5rem;
`

const Brief = styled.h5`
  font-size: 2.25rem;
  font-weight: 300;
  margin-bottom: 1rem;
`

export default Title
