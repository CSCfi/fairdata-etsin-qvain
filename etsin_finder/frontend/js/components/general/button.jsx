import React from 'react'
import styled from 'styled-components'
import { opacify, darken } from 'polished'

// prettier-ignore
const StyledButton = styled.button`
  cursor: pointer;
  padding: ${props => (props.noPadding ? 0 : '0.3em 0.6em 0.4em')};
  margin: ${props => (props.noMargin ? 0 : '0.25em 0.25em')};
  border: ${props => (props.thin ? '1px' : '2px')} solid ${props => (props.color ? props.color : props.theme.color.primary)};
  background-color: ${props => (props.color ? props.color : props.theme.color.primary)};
  color: ${props => (props.color !== 'white' ? 'white' : props.theme.color.primary)};
  border-radius: 0.25em;
  line-height: 1.25;
  transition: 0.3s ease;
  &:hover {
    background-color: ${props => darken(0.1, (props.color ? props.color : props.theme.color.primary))};
    border-color: ${props => darken(0.1, (props.color ? props.color : props.theme.color.primary))};
  }
  &:disabled {
    pointer-events:none;
    background-color: ${props => props.theme.color.superlightgray};
    color: ${props => props.theme.color.medgray};
    border-color: ${props => props.theme.color.superlightgray};
  }
`
// prettier-ignore
const InvertedStyledButton = StyledButton.extend`
  border-color: ${props => (props.color ? props.color : props.theme.color.primary)};
  background-color: transparent;
  color: ${props => (props.color ? props.color : props.theme.color.primary)};
  &:hover {
    background-color: ${props => (props.color ? props.color : props.theme.color.primary)};
    color: ${props => (props.color === 'white' ? props.theme.color.primary : 'white')};
  }
  &:disabled {
    pointer-events: none;
    background-color: transparent;
    border-color: ${props => opacify(-0.5, (props.color ? props.color : props.theme.color.primary))};
    color: ${props => opacify(-0.5, (props.color ? props.color : props.theme.color.primary))};
  }
`
const TransparentStyledButton = StyledButton.extend`
  margin: ${props => (props.noMargin ? 0 : '0.1em 0.1em')};
  border: none;
  background-color: transparent;
  color: ${props => (props.color ? props.color : props.theme.color.darkgray)};
  &:hover {
    background-color: transparent;
    color: ${props => props.theme.color.primary};
    text-decoration: underline;
  }
  &:focus {
    outline: none;
    box-shadow: none;
    text-decoration: underline;
    color: ${props => props.theme.color.primary};
  }
  &:disabled {
    color: ${props => props.theme.color.gray};
    background-color: transparent;
  }
`

const LinkStyledButton = TransparentStyledButton.extend`
  margin: 0;
  padding: 0;
  color: ${props => props.theme.color.primary};
  &:hover {
    color: ${props => darken(0.1, props.theme.color.primary)};
  }
`

const Button = props => <StyledButton {...props} />
export const InvertedButton = props => <InvertedStyledButton {...props} />
export const TransparentButton = props => <TransparentStyledButton {...props} />
export const LinkButton = props => <LinkStyledButton {...props} />

export default Button
