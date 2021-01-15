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
import Translate from 'react-translate-component'
import { HelpIcon } from '../qvain/general/modal/form'
import Tooltip from '../qvain/general/section/tooltip'
import Button from '../general/button'

const SelectContainer = styled.div`
  width: ${props => props.width};
  position: relative;
`

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
    background: ${props => (darken(0.1, props.background))};
  }
`
const ListItems = styled.div`
  position: absolute;
  width: 100%;
  z-index: 1;
`

const ListItem = styled(ListButton)`
  &:first-of-type {
    border-top: 1px solid ${props => darken(0.2, props.background)};
  }
  &:last-of-type {
    border-radius: 0 0 5px 5px;
  }
  background-color: white;
  color: ${props => props.color};
  border: 1px solid;
`

const Controller = styled(ListButton)`
  transition: 0.3s ease;
  border-radius: ${props => (props.isOpen ? '5px 5px 0 0' : '5px 5px 5px 5px')};
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: white;
  &:after {
    transform: ${props => (props.isOpen ? 'rotate(180deg)' : 'rotate(0deg)')};
    content: '';
    width: 0.3em;
    border-top: 0.3em solid white;
    border-right: 0.3em solid transparent;
    border-left: 0.3em solid transparent;
  }
`

const InfoPosition = styled.div`
   {
    position: absolute;
    top: 8px;
    right: -25px;
  }
`

const Text = styled.span`
   {
    padding-right: 10px;
  }
`

export default class FormatSelect extends Component {
  constructor(props) {
    super(props)

    this.state = {
      listOpen: false,
      frontColor: props.frontColor ? props.frontColor : props.background,
      color: props.color,
      background: props.background,
      padding: props.padding,
      tooltipOpen: false,
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

  changeSelected = selectedformat => {
    this.setState(
      state => ({
        listOpen: !state.listOpen
      }),
      () => {
        this.props.onChange(selectedformat)
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

  render() {
    return (
      <SelectContainer width={this.props.width}>
        <Controller
          noMargin
          color={this.state.color}
          padding={this.state.padding}
          background={this.state.background}
          isOpen={this.state.listOpen}
          onClick={this.toggleOpen}
        >
          <Translate component={Text} content="dataset.datasetAsFile.open" />
        </Controller>

        {this.state.listOpen && (
          <ListItems>
            {this.props.options.map((single, i) => (
              <ListItem
                noMargin
                color={this.state.color}
                padding={this.state.padding}
                key={single.value}
                onClick={() => this.changeSelected(single)}
                value={single.value}
                ref={e => this.setFirstOptionRef(e, i)}
                background={this.state.frontColor}
                removed={single.removed}
              >
                {this.props.options[0] === single ? (
                  <span className="sr-only">Current version: </span>
                ) : (
                  ''
                )}
                <Translate content={`dataset.datasetAsFile.${single.value}`} />
              </ListItem>
            ))}
          </ListItems>
        )}

        {this.props.options.length > 1 && (
          <InfoPosition>
            <Tooltip
              isOpen={this.state.tooltipOpen}
              close={() => this.setState(prev => ({ tooltipOpen: !prev.tooltipOpen }))}
              align="Right"
              text={<Translate component="p" content="dataset.datasetAsFile.infoText" />}
            >
              <HelpIcon
                onClick={() => this.setState(prev => ({ tooltipOpen: !prev.tooltipOpen }))}
                align="Left"
              />
            </Tooltip>
          </InfoPosition>
        )}
      </SelectContainer>
    )
  }
}

FormatSelect.defaultProps = {
  background: 'blue',
  color: 'black',
  padding: '0.3em 0.6em',
  frontColor: undefined,
  width: '7em',
}

FormatSelect.propTypes = {
  onChange: PropTypes.func.isRequired,
  options: PropTypes.array.isRequired,
  background: PropTypes.string,
  color: PropTypes.string,
  padding: PropTypes.string,
  frontColor: PropTypes.string,
  width: PropTypes.string,
}
