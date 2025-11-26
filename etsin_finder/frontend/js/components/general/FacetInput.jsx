import styled from "styled-components";

export const FacetInput = styled.input`
    display: block;
    box-sizing: border-box;
    width: 100%;
    max-width: 5em;
    min-width: 4em;
    padding: 0.4em 0.6em;
    border: 1px solid hsl(0, 0%, 80%);
    border-radius: 4px;
    color: ${props => props.theme.color.darkgray};
    &::placeholder {
        color: ${props => props.theme.color.gray};
        font-style: italic;
    }
    &:hover {
        border-color: hsl(0, 0%, 70%);
    }
    &:focus {
        border-color: hsl(0, 0%, 70%);
  }

`