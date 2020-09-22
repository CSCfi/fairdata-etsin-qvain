import React from 'react'
import styled from 'styled-components'
import Title from './title'
import LoginButton from './loginButton'

const landingPage = () => (
  <Container>
    <Title />
    <Divider />
    <LoginButton />
  </Container>
)

const Container = styled.div`
  margin: 1em;
  padding: 4em;
  background-color: #e7e9ed;
`

const Divider = styled.hr`
  border-color: #ababab;
  border-top: 1px;
  margin: 0.5em 0 2em 0;
`

export default landingPage
