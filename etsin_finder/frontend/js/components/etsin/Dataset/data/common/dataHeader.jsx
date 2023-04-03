import styled from 'styled-components'
import IconButton from './iconButton'

export const Header = styled.div`
  display: grid;
  align-items: center;
  margin-bottom: 0.5rem;
  grid-template-columns: 1fr auto;
  column-gap: 0.5rem;
`

export const HeaderTitle = styled.h2`
  grid-row: 1;
  grid-column: 1;
  line-height: 1.5;
  margin-bottom: 0;
`

export const HeaderStats = styled.span`
  grid-row: 2;
  grid-column: 1;
`
export const HeaderButtonWrapper = styled.div`
  grid-row: 1/3;
  grid-column: 2;
`

export const HeaderButton = styled(IconButton).attrs({
  Wrapper: HeaderButtonWrapper,
})`
  padding: 0.5rem 0.75rem;
  margin: 0;
`
