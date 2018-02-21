import styled from 'styled-components'

const Tooltip = styled.div`
  display: inline-block;
  position: relative;
  color: inherit;
  background-color: transparent;
  &:before {
    display: none;
    content: "${props => props.title}";
    padding: 3px 8px;
    position: absolute;
    bottom: 100%;
    left: 50%;
    transform: translate(-50%, -4px);
    white-space: nowrap;
    color: white;
    background-color: #181818;
    border-radius: 5px;
  }
  &:after {
    display: none;
    position: absolute;
    bottom: 100%;
    left: 50%;
    transform: translate(-50%, 8px);
    content: ' ';
    border: 6px solid transparent;
    border-top-color: #181818;
  }
  &:hover {
    &:before,
    &:after {
      display: block;
    }
  }
`

export default Tooltip
