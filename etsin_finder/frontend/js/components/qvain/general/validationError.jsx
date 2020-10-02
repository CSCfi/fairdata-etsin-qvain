import styled from 'styled-components';

const ValidationError = styled.p`
  color: red;
  :empty {
    display: none;
  }
`

export default ValidationError;
