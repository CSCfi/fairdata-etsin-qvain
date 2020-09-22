import styled from 'styled-components';

export const PaginationItem = styled.span.attrs(() => ({
  size: '40px',
}))`
  cursor: pointer;
  display: block;
  text-align: center;
  margin: 0.2em 0.2em;
  background-color: ${props => props.theme.color.lightgray};
  width: ${props => props.size};
  height: ${props => props.size};
  border-radius: ${props => props.size};
  line-height: ${props => props.size};
  color: black;
  padding: 0;
  border: 0;
  &.current {
    cursor: initial;
    background-color: ${props => props.theme.color.primary};
    color: white;
  }
  &.pagination-rest {
    cursor: initial;
    background-color: transparent;
    width: ${props => props.size};
    height: ${props => props.size};
    border-radius: ${props => props.size};
    line-height: ${props => props.size};
  }
  &[disabled] {
    color: ${(props) => props.theme.color.darkgray};
  }
`

export const PaginationButton = PaginationItem.withComponent('button')

export const PaginationContainer = styled.div`
  margin-top: 1em;
  justify-content: center;
  flex-wrap: wrap;
  display: flex;
  ul {
    display: flex;
    padding-left: 0;
    list-style: none;
    border-radius: 0.25rem;
    flex-wrap: wrap;
  }
`
