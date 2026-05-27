import styled from 'styled-components'

export const MobileOnly = styled.div`
  @media screen and (min-width: 1120px) {
    display: none;
    background: red;
  }
`

export const DesktopOnly = styled.div`
  @media not screen and (min-width: 1120px) {
    display: none;
  }
`
