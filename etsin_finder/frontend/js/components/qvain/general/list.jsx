import styled from 'styled-components';

export const List = styled.ul`
  padding: 0px;
  margin: 0;
  list-style-type: none;
`

export const ListItem = styled.li`
  padding-left: 48px;
  height: 40px;
  display: flex;
  position: relative;
  align-items: center;
  justify-content: flex-start;
  overflow: hidden;
  cursor: pointer;
  color: ${props => (props.disabled ? 'grey' : 'inherit')};
`
