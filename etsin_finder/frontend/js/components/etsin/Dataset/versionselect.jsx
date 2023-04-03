{
  /**
   * This file is part of the Etsin service
   *
   * Copyright 2017-2018 Ministry of Education and Culture, Finland
   *
   *
   * @author    CSC - IT Center for Science Ltd., Espoo Finland <servicedesk@csc.fi>
   * @license   MIT
   */
}

import React, { Component } from 'react'
import styled from 'styled-components'
import { darken } from 'polished'
import PropTypes from 'prop-types'

import Button from '../general/button'
import etsinTheme from '@/styles/theme'

const SelectContainer = styled.div`
  width: ${props => props.width};
  margin-right: 1em;
  z-index: 1;
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
  background: ${props => props.background};
  &:hover {
    background: ${props => darken(0.1, props.background)};
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

    this.state = {
      listOpen: false,
      selected: props.value,
      newestColor: props.newestColor ? props.newestColor : props.background,
      background: props.background,
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
      state => ({
        listOpen: !state.listOpen
      }),
      () => {
        this.props.onChange(selected)
      }
    )
  }

  toggleOpen = () => {
    this.setState(
      state => ({
        listOpen: !state.listOpen
      }),
      () => {
        if (this.state.listOpen) {
          this.focusFirstOption()
        }
      }
    )
  }

  selectColor = selected => {
    let color
    if (selected.old && !selected.removed) {
      color = this.state.background
    } else if (selected.removed) {
      color = this.props.error
    } else {
      color = this.state.newestColor
    }
    return color
  }

  render() {
    const { selected } = this.state
    return (
      <SelectContainer width={this.props.width}>
        <Controller
          noMargin
          color={selected.old && !selected.removed ? etsinTheme.color.dark : this.props.color}
          padding={this.props.padding}
          background={this.selectColor(selected)}
          isOpen={this.state.listOpen}
          onClick={this.toggleOpen}
        >
          <span className="sr-only">Version selector (with current version) </span>
          {selected.label}
        </Controller>
        {this.state.listOpen && (
          <List width={this.props.width} background={this.props.background}>
            {this.props.options.map((single, i) => (
              <ListItem
                noMargin
                color={single.old ? etsinTheme.color.dark : this.props.color}
                padding={this.props.padding}
                key={single.value}
                onClick={() => this.changeSelected(single)}
                value={single.value}
                ref={e => this.setFirstOptionRef(e, i)}
                background={this.selectColor(single)}
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
  error: PropTypes.string.isRequired,
  width: PropTypes.string,
}
