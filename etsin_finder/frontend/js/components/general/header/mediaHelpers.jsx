import styled from 'styled-components'

export const MobileOnly = styled.div`
  @media screen and (min-width: ${p => p.theme.breakpoints.lg}) {
    display: none;
    background: red;
  }
`

export const DesktopOnly = styled.div`
  @media not screen and (min-width: ${p => p.theme.breakpoints.lg}) {
    display: none;
  }
`
