import styled from 'styled-components';

const ValidationError = styled.p`
  color: ${(props) => props.theme.color.redText};
  :empty {
    display: none;
  }
`

export default ValidationError;
