import styled from 'styled-components'

export const ApplicationSection = styled.section`
  padding-top: 1rem;
  border-top: 1px solid ${p => p.theme.color.lightgray};
  &:first-child {
    border-top: none;
  }

  h3,
  h4,
  .heading3,
  .heading4 {
    margin-top: 0.5rem;
    margin-bottom: 0.25rem;
  }
`
