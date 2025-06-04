import styled from "styled-components"

import { Container } from '@/components/qvain/general/card'

export const Buttons = styled.div`
  display: flex;
  flex-wrap: wrap;
  * {
    margin: 0.25rem;
    flex-grow: 1;
  }
  margin: -0.25rem;
`


export const FileContainer = styled(Container)`
  border: none;
  padding: 0;
  margin: 0;
  box-shadow: none;
`

export const DirectoryContainer = styled(FileContainer)``