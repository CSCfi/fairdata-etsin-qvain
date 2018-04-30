import React, { Component } from 'react'
import styled from 'styled-components'
import { darken } from 'polished'
import PropTypes from 'prop-types'

import Button from '../general/button'

const SelectContainer = styled.div`
  width: ${props => props.width};
  margin-right: 1em;
`

const List = styled.div`
  width: ${props => props.width};
  position: absolute;
`

/* prettier-ignore */
const ListButton = styled(Button)`
  color: ${props => props.color};
  padding: ${props => props.padding};
  border-radius: 0;
  width: 100%;
  text-align: left;
  display: block;
  border: 0;
  background: ${props => (props.removed ? props.theme.color.error : props.background)};
  &:hover {
    background: ${props => (props.removed ? darken(0.1, props.theme.color.error) : darken(0.1, props.background))};
  }
`

const ListItem = styled(ListButton)`
  &:first-of-type {
    border-top: 1px solid ${props => darken(0.2, props.background)};
  }
  &:last-of-type {
    border-radius: 0 0 5px 5px;
  }
`

const Controller = styled(ListButton)`
  transition: 0.3s ease;
  border-radius: ${props => (props.isOpen ? '5px 5px 0 0' : '5px 5px 5px 5px')};
  display: flex;
  align-items: center;
  justify-content: space-between;
  &:after {
    transform: ${props => (props.isOpen ? 'rotate(180deg)' : 'rotate(0deg)')};
    content: '';
    width: 0.3em;
    border-top: 0.3em solid ${props => props.color};
    border-right: 0.3em solid transparent;
    border-left: 0.3em solid transparent;
  }
`

export default class VersionSelect extends Component {
  constructor(props) {
    super(props)

    this.timeoutID = undefined

    this.state = {
      isOpen: false,
      options: props.options,
      selected: props.value,
      newestColor: props.newestColor ? props.newestColor : props.background,
      color: props.color,
      background: props.background,
      padding: props.padding,
      width: props.width,
      removed: props.value.removed,
    }
  }

  componentWillReceiveProps(newProps) {
    if (newProps !== this.props) {
      this.setState({
        isOpen: false,
        options: newProps.options,
        selected: newProps.value,
      })
    }
  }

  onBlur = () => {
    this.timeoutID = setTimeout(() => {
      if (this.state.isFocused) {
        this.setState({
          isFocused: false,
          isOpen: false,
        })
      }
    }, 0)
  }

  onFocus = () => {
    clearTimeout(this.timeoutID)
    if (!this.state.isFocused) {
      this.setState({
        isFocused: true,
      })
    }
  }

  setFirstOptionRef = (element, counter) => {
    if (counter === 0) {
      this.firstOption = element
    }
  }

  focusFirstOption = () => {
    if (this.firstOption) {
      this.firstOption.focus()
    }
  }

  changeSelected = selected => {
    this.setState(
      {
        selected,
        isOpen: false,
        isFocused: false,
      },
      () => {
        this.props.onChange('Version Select', selected)
      }
    )
  }

  toggleOpen = () => {
    this.setState(
      {
        isOpen: !this.state.isOpen,
      },
      () => {
        if (this.state.isOpen) {
          this.focusFirstOption()
        }
      }
    )
  }

  render() {
    return (
      <SelectContainer width={this.state.width} onFocus={this.onFocus} onBlur={this.onBlur}>
        <Controller
          noMargin
          color={this.state.color}
          padding={this.state.padding}
          background={
            this.props.options[0] === this.state.selected
              ? this.state.newestColor
              : this.state.background
          }
          isOpen={this.state.isOpen}
          onClick={this.toggleOpen}
          removed={this.state.removed}
        >
          <span className="sr-only">Version selector (with current version) </span>
          {this.state.selected.label}
        </Controller>
        {this.state.isOpen &&
          this.state.isFocused && (
            <List width={this.state.width} background={this.props.background}>
              {this.state.options.map((single, i) => (
                <ListItem
                  noMargin
                  color={this.state.color}
                  padding={this.state.padding}
                  key={single.value}
                  onClick={() => this.changeSelected(single)}
                  value={single.value}
                  innerRef={e => this.setFirstOptionRef(e, i)}
                  background={
                    this.props.options[0] === single
                      ? this.state.newestColor
                      : this.props.background
                  }
                  removed={single.removed}
                >
                  {this.props.options[0] === single ? (
                    <span className="sr-only">Current version: </span>
                  ) : (
                    ''
                  )}
                  {single.label}
                </ListItem>
              ))}
            </List>
          )}
      </SelectContainer>
    )
  }
}

VersionSelect.defaultProps = {
  background: 'blue',
  color: 'black',
  padding: '0.3em 0.6em',
  newestColor: undefined,
  width: '7em',
}

VersionSelect.propTypes = {
  onChange: PropTypes.func.isRequired,
  options: PropTypes.array.isRequired,
  value: PropTypes.object.isRequired,
  background: PropTypes.string,
  color: PropTypes.string,
  padding: PropTypes.string,
  newestColor: PropTypes.string,
  width: PropTypes.string,
}
