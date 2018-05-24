import styled from 'styled-components'
import PropTypes from 'prop-types'

import { opacify, darken } from 'polished'
import checkColor from '../../styles/styledUtils'

// prettier-ignore
const Button = styled.button.attrs({
  padding: props => (props.padding ? props.padding : '0.3em 0.6em 0.4em'),
  margin: props => (props.margin ? props.margin : '0.25em 0.25em'),
})`
  cursor: pointer;
  width: ${props => (props.width ? props.width : '')};
  padding: ${props => (props.noPadding ? 0 : props.padding)};
  margin: ${props => (props.noMargin ? 0 : props.margin)};
  border: ${props => (props.thin ? '1px' : '2px')} solid ${props => (props.color ? checkColor(props.color) : props.theme.color.primary)};
  background-color: ${props => (props.color ? checkColor(props.color) : props.theme.color.primary)};
  color: ${props => (props.color !== 'white' ? 'white' : props.theme.color.primary)};
  border-radius: ${p => (p.br ? p.br : '0.25em')};
  line-height: 1.25;
  transition: 0.3s ease;
  &:hover {
    background-color: ${props => darken(0.1, (props.color ? checkColor(props.color) : props.theme.color.primary))};
    border-color: ${props => darken(0.1, (props.color ? checkColor(props.color) : props.theme.color.primary))};
  }
  &:disabled {
    pointer-events: none;
    background-color: ${props => props.theme.color.superlightgray};
    color: ${props => props.theme.color.medgray};
    border-color: ${props => props.theme.color.superlightgray};
  }
`

// prettier-ignore
export const Link = styled.a.attrs({
  padding: props => (props.padding ? props.padding : '0.3em 0.6em 0.4em'),
  margin: props => (props.margin ? props.margin : '0.25em 0.25em'),
})`
  cursor: pointer;
  width: ${props => (props.width ? props.width : 'max-content')};
  padding: ${props => (props.noPadding ? 0 : props.padding)};
  margin: ${props => (props.noMargin ? 0 : props.margin)};
  border: ${props => (props.thin ? '1px' : '2px')} solid ${props => (props.color ? checkColor(props.color) : props.theme.color.primary)};
  background-color: ${props => (props.color ? checkColor(props.color) : props.theme.color.primary)};
  color: ${props => (props.color !== 'white' ? 'white' : props.theme.color.primary)};
  border-radius: 0.25em;
  line-height: 1.25;
  transition: 0.3s ease;
  text-align: center;
  display: block;
  &:hover {
    text-decoration: none;
    color: ${props => (props.color !== 'white' ? 'white' : props.theme.color.primary)};
    background-color: ${props => darken(0.1, props.color ? checkColor(props.color) : props.theme.color.primary)};
    border-color: ${props => darken(0.1, props.color ? checkColor(props.color) : props.theme.color.primary)};
  }
  &:disabled {
    pointer-events: none;
    background-color: ${props => props.theme.color.superlightgray};
    color: ${props => props.theme.color.medgray};
    border-color: ${props => props.theme.color.superlightgray};
  }
`

// prettier-ignore
export const InvertedButton = Button.extend`
  border-color: ${props => (props.color ? checkColor(props.color) : props.theme.color.primary)};
  background-color: transparent;
  color: ${props => (props.color ? checkColor(props.color) : props.theme.color.primary)};
  &:hover, &:focus {
    background-color: ${props => (props.color ? checkColor(props.color) : props.theme.color.primary)};
    border-color: ${props => (props.color ? checkColor(props.color) : props.theme.color.primary)};
    color: ${props => (props.color === 'white' ? props.theme.color.primary : 'white')};
  }
  &:disabled {
    pointer-events: none;
    background-color: transparent;
    border-color: ${props => opacify(-0.5, (props.color ? checkColor(props.color) : props.theme.color.primary))};
    color: ${props => opacify(-0.5, (props.color ? checkColor(props.color) : props.theme.color.primary))};
  }
  &.active {
    background-color: ${props => (props.color ? checkColor(props.color) : props.theme.color.primary)};
    border-color: ${props => (props.color ? checkColor(props.color) : props.theme.color.primary)};
    color: ${props => (props.color === 'white' ? props.theme.color.primary : 'white')};
    &:hover, &:focus {
      background-color: ${props => (props.color ? darken(0.1, checkColor(props.color)) : darken(0.1, props.theme.color.primary))};
      border-color: ${props => (props.color ? darken(0.1, checkColor(props.color)) : darken(0.1, props.theme.color.primary))};
    }
  }
`

// prettier-ignore
export const InvertedLink = Link.extend`
  border-color: ${props => (props.color ? checkColor(props.color) : props.theme.color.primary)};
  background-color: transparent;
  color: ${props => (props.color ? checkColor(props.color) : props.theme.color.primary)};
  &:hover, &:focus {
    background-color: ${props => (props.color ? checkColor(props.color) : props.theme.color.primary)};
    border-color: ${props => (props.color ? checkColor(props.color) : props.theme.color.primary)};
    color: ${props => (props.color === 'white' ? props.theme.color.primary : 'white')};
  }
  &:disabled {
    pointer-events: none;
    background-color: transparent;
    border-color: ${props => opacify(-0.5, (props.color ? checkColor(props.color) : props.theme.color.primary))};
    color: ${props => opacify(-0.5, (props.color ? checkColor(props.color) : props.theme.color.primary))};
  }
  &.active {
    background-color: ${props => (props.color ? checkColor(props.color) : props.theme.color.primary)};
    border-color: ${props => (props.color ? checkColor(props.color) : props.theme.color.primary)};
    color: ${props => (props.color === 'white' ? props.theme.color.primary : 'white')};
    &:hover, &:focus {
      background-color: ${props => darken(0.1, (props.color ? checkColor(props.color) : props.theme.color.primary))};
      border-color: ${props => darken(0.1, (props.color ? checkColor(props.color) : props.theme.color.primary))};
    }
  }
`

export const TransparentButton = styled(Button).attrs({
  margin: props => (props.margin ? props.margin : '0.1em'),
})`
  margin: ${props => (props.noMargin ? 0 : props.margin)};
  border-color: transparent;
  background-color: transparent;
  color: ${props => (props.color ? checkColor(props.color) : props.theme.color.darkgray)};
  &:hover {
    border-color: transparent;
    background-color: transparent;
    color: ${p => darken(0.1, p.color ? checkColor(p.color) : p.theme.color.primary)};
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

export const LinkButton = TransparentButton.extend`
  margin: 0;
  padding: 0;
  color: ${props => (props.color ? checkColor(props.color) : props.theme.color.primary)};
  &:hover {
    color: ${p => darken(0.1, p.color ? checkColor(p.color) : p.theme.color.primary)};
  }
`

export default Button

// PROPS
Button.propTypes = {
  width: PropTypes.string,
  padding: PropTypes.string,
  margin: PropTypes.string,
  noMargin: PropTypes.bool,
  noPadding: PropTypes.bool,
  thin: PropTypes.bool,
  color: PropTypes.string,
  // border radius
  br: PropTypes.string,
}
