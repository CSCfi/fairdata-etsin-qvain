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
import ReactSelect from 'react-select'
import styled from 'styled-components'
import { lighten } from 'polished'
import PropTypes from 'prop-types'

// react-select library: https://github.com/JedWatson/react-select

export default class Select extends Component {
  handleChange = value => {
    // this is going to call setFieldValue and manually update values.topics
    this.props.onChange(this.props.name, value)
  }

  handleBlur = () => {
    // this is going to call setFieldTouched and manually update touched.topcis
    this.props.onBlur(this.props.name, true)
  }

  render() {
    const { className, error, name, options, value, clearable, ...rest } = this.props
    return (
      <SelectContainer
        className={className}
        error={error}
        {...rest}
        options={options}
        value={value}
      >
        <ReactSelect
          id={name}
          clearable={clearable}
          name={name}
          options={options}
          onChange={this.handleChange}
          onBlur={this.handleBlur}
          value={value}
          noResultsText={false}
          searchable={false}
        />
      </SelectContainer>
    )
  }
}
/* prettier-ignore */
const SelectContainer = styled.div.attrs(props => ({
  current: props.options[0] === props.value ? props.colorCurrent : undefined,
  bordercolor: props.bordercolor ? props.bordercolor : props.theme.color.gray,
  background: props.background ? props.background : 'white',
  textcolor: props.textcolor ? props.textcolor : '#666',
  selectedcolor: props.selectedColor ? props.selectedColor : '#333',
  placeholder: props.textcolor ? props.textcolor : '#aaa',
  textpadding: props.textpadding ? props.textpadding : '1.2em',
}))`
  margin-bottom: 1em;
  height: min-content;
  .Select {
    position: relative;
    input {
      &::-webkit-contacts-auto-fill-button,
      &::-webkit-credentials-auto-fill-button,
      &::-ms-clear,
      &::-ms-reveal {
        display: none !important;
      }
    }
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    div,
    input,
    span {
      -webkit-box-sizing: border-box;
      -moz-box-sizing: border-box;
      box-sizing: border-box;
    }
    &.is-disabled {
      .Select-arrow-zone {
        cursor: default;
        pointer-events: none;
        opacity: 0.35;
      }
      > .Select-control {
        background-color: #f9f9f9;
        &:hover {
          box-shadow: none;
        }
      }
    }
    &.is-open > .Select-control {
      border-bottom-right-radius: 0;
      border-bottom-left-radius: 0;
      background: ${props => (props.current ? props.first : props.background)};
      border-color: #b3b3b3 ${props => props.bordercolor} #d9d9d9;
      .Select-arrow {
        top: -2px;
        border-color: transparent transparent ${props => lighten(0.2, props.textcolor)};
        border-width: 0 5px 5px;
      }
    }
    &.is-searchable {
      &.is-open > .Select-control,
      &.is-focused:not(.is-open) > .Select-control {
        cursor: text;
      }
    }
    &.is-focused {
      > .Select-control {
        background: ${props => (props.current ? props.first : props.background)};
      }
      &:not(.is-open) > .Select-control {
        border-color: #007eff;
        background: ${props => (props.current ? props.first : props.background)};
      }
    }
    &.has-value {
      &.is-clearable.Select--single > .Select-control .Select-value {
        padding-right: 42px;
      }
      &.Select--single > .Select-control .Select-value .Select-value-label,
      &.is-pseudo-focused.Select--single > .Select-control .Select-value .Select-value-label {
        color: ${props => props.selectedcolor};
      }
      &.Select--single > .Select-control .Select-value a.Select-value-label,
      &.is-pseudo-focused.Select--single > .Select-control .Select-value a.Select-value-label {
        cursor: pointer;
        text-decoration: none;
      }
      &.Select--single > .Select-control .Select-value a.Select-value-label:hover,
      &.is-pseudo-focused.Select--single > .Select-control .Select-value a.Select-value-label:hover,
      &.Select--single > .Select-control .Select-value a.Select-value-label:focus,
      &.is-pseudo-focused.Select--single
        > .Select-control
        .Select-value
        a.Select-value-label:focus {
        color: #007eff;
        outline: none;
        text-decoration: underline;
      }
      &.Select--single > .Select-control .Select-value a.Select-value-label:focus {
        background: ${props => props.background};
      }
      &.is-pseudo-focused {
        &.Select--single > .Select-control .Select-value a.Select-value-label:focus {
          background: ${props => props.background};
        }
        .Select-input {
          opacity: 0;
        }
      }
    }
    &.is-open .Select-arrow,
    .Select-arrow-zone:hover > .Select-arrow {
      border-top-color: ${props => props.textcolor};
    }
    &.Select--rtl {
      direction: rtl;
      text-align: right;
    }
  }

  .Select-control {
    background-color: ${props => (props.current ? props.first : props.background)};
    border-radius: 4px;
    border: 1px solid ${props => (props.error ? props.theme.color.error : props.bordercolor)};
    color: ${props => props.selectedcolor};
    cursor: default;
    display: table;
    border-spacing: 0;
    border-collapse: separate;
    height: 38px;
    outline: none;
    overflow: hidden;
    position: relative;
    width: 100%;
    &:hover {
      box-shadow: 0 1px 0 rgba(0, 0, 0, 0.06);
    }
    .Select-input:focus {
      outline: none;
      background: ${props => (props.current ? props.first : props.background)};
    }
  }

  .Select-placeholder,
  .Select--single > .Select-control .Select-value {
    bottom: 0;
    color: ${props => props.placeholder};
    left: 0;
    line-height: 36px;
    padding-left: ${props => props.textpadding};
    padding-right: ${props => props.textpadding};
    position: absolute;
    right: 0;
    top: 0;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .Select-input {
    height: 36px;
    padding-left: ${props => props.textpadding};
    padding-right: ${props => props.textpadding};
    vertical-align: middle;
    > input {
      width: 100%;
      background: none transparent;
      border: 0 none;
      box-shadow: none;
      cursor: default;
      display: inline-block;
      font-family: inherit;
      font-size: inherit;
      margin: 0;
      outline: none;
      line-height: 17px;
      /* For IE 8 compatibility */
      padding: 8px 0 12px;
      /* For IE 8 compatibility */
      -webkit-appearance: none;
    }
  }

  .is-focused .Select-input > input {
    cursor: text;
  }

  .has-value.is-pseudo-focused .Select-input {
    opacity: 0;
  }

  .Select-control:not(.is-searchable) > .Select-input {
    outline: none;
  }

  .Select-loading-zone {
    cursor: pointer;
    display: table-cell;
    position: relative;
    text-align: center;
    vertical-align: middle;
    width: 16px;
  }

  .Select-loading {
    -webkit-animation: Select-animation-spin 400ms infinite linear;
    -o-animation: Select-animation-spin 400ms infinite linear;
    animation: Select-animation-spin 400ms infinite linear;
    width: 16px;
    height: 16px;
    box-sizing: border-box;
    border-radius: 50%;
    border: 2px solid ${props => props.bordercolor};
    border-right-color: ${props => props.selectedcolor};
    display: inline-block;
    position: relative;
    vertical-align: middle;
  }

  .Select-clear-zone {
    -webkit-animation: Select-animation-fadeIn 200ms;
    -o-animation: Select-animation-fadeIn 200ms;
    animation: Select-animation-fadeIn 200ms;
    color: ${props => lighten(0.2, props.textcolor)};
    cursor: pointer;
    display: table-cell;
    position: relative;
    text-align: center;
    vertical-align: middle;
    width: 2em;
    &:hover {
      color: ${props => props.theme.color.error};
    }
  }

  .Select-clear {
    display: inline-block;
    font-size: 18px;
    line-height: 1;
  }

  .Select--multi .Select-clear-zone {
    width: 17px;
  }

  .Select-arrow-zone {
    cursor: pointer;
    display: table-cell;
    position: relative;
    text-align: center;
    vertical-align: middle;
    width: 25px;
    padding-right: 5px;
  }

  .Select--rtl .Select-arrow-zone {
    padding-right: 0;
    padding-left: 5px;
  }

  .Select-arrow {
    border-color: ${props => lighten(0.2, props.textcolor)} transparent transparent;
    border-style: solid;
    border-width: 5px 5px 2.5px;
    display: inline-block;
    height: 0;
    width: 0;
    position: relative;
  }

  .Select-control > *:last-child {
    padding-right: 1em;
  }

  .Select--multi .Select-multi-value-wrapper {
    display: inline-block;
  }

  .Select .Select-aria-only {
    position: absolute;
    display: block;
    height: 1px;
    width: 1px;
    margin: -1px;
    clip: rect(0, 0, 0, 0);
    overflow: hidden;
    float: left;
  }

  @-webkit-keyframes Select-animation-fadeIn {
    from {
      opacity: 0;
    }

    to {
      opacity: 1;
    }
  }

  @keyframes Select-animation-fadeIn {
    from {
      opacity: 0;
    }

    to {
      opacity: 1;
    }
  }

  .Select-menu-outer {
    border-bottom-right-radius: 4px;
    border-bottom-left-radius: 4px;
    background-color: ${props => props.background};
    border: 1px solid ${props => props.bordercolor};
    border-top-color: ${props => props.bordercolor};
    box-shadow: 0 1px 0 rgba(0, 0, 0, 0.06);
    box-sizing: border-box;
    margin-top: -1px;
    max-height: 200px;
    position: absolute;
    left: 0;
    top: 100%;
    width: 100%;
    z-index: 1;
    -webkit-overflow-scrolling: touch;
  }

  .Select-menu {
    max-height: 198px;
    overflow-y: auto;
  }

  .Select-option {
    box-sizing: border-box;
    background-color: ${props => props.background};
    color: ${props => props.textcolor};
    cursor: pointer;
    display: block;
    padding: 8px ${props => props.textpadding};
    &:last-child {
      border-bottom-right-radius: 4px;
      border-bottom-left-radius: 4px;
    }
    &.is-selected {
      background-color: #f5faff;
      /* Fallback color for IE 8 */
      background-color: rgba(255, 255, 255, 0.1);
      color: ${props => props.selectedcolor};
    }
    &.is-focused {
      background-color: #ebf5ff;
      /* Fallback color for IE 8 */
      background-color: rgba(0, 0, 0, 0.06);
      color: ${props => props.selectedcolor};
    }
    &.is-disabled {
      color: ${props => props.bordercolor};
      cursor: default;
    }
    &:first-of-type {
      background-color: ${props => props.first};
    }
  }

  .Select-noresults {
    box-sizing: border-box;
    color: ${props => props.textcolor};
    cursor: default;
    display: block;
    padding: 8px ${props => props.textpadding};
  }

  .Select--multi {
    .Select-input {
      vertical-align: middle;
      margin-left: ${props => props.textpadding};
      padding: 0;
    }
    &.Select--rtl .Select-input {
      margin-left: 0;
      margin-right: ${props => props.textpadding};
    }
    &.has-value .Select-input {
      margin-left: 5px;
    }
    .Select-value {
      background-color: #ebf5ff;
      /* Fallback color for IE 8 */
      background-color: rgba(0, 126, 255, 0.08);
      border-radius: 2px;
      border: 1px solid #c2e0ff;
      /* Fallback color for IE 8 */
      border: 1px solid rgba(0, 126, 255, 0.24);
      color: #007eff;
      display: inline-block;
      font-size: 0.9em;
      line-height: 1.4;
      margin-left: 5px;
      margin-top: 5px;
      vertical-align: top;
    }
    .Select-value-icon {
      display: inline-block;
      vertical-align: middle;
    }
    .Select-value-label {
      display: inline-block;
      vertical-align: middle;
      border-bottom-right-radius: 2px;
      border-top-right-radius: 2px;
      cursor: default;
      padding: 2px 5px;
    }
    a.Select-value-label {
      color: #007eff;
      cursor: pointer;
      text-decoration: none;
      &:hover {
        text-decoration: underline;
      }
    }
    .Select-value-icon {
      cursor: pointer;
      border-bottom-left-radius: 2px;
      border-top-left-radius: 2px;
      border-right: 1px solid #c2e0ff;
      /* Fallback color for IE 8 */
      border-right: 1px solid rgba(0, 126, 255, 0.24);
      padding: 1px 5px 3px;
      &:hover,
      &:focus {
        background-color: #d8eafd;
        /* Fallback color for IE 8 */
        background-color: rgba(0, 113, 230, 0.08);
        color: #0071e6;
      }
      &:active {
        background-color: #c2e0ff;
        /* Fallback color for IE 8 */
        background-color: rgba(0, 126, 255, 0.24);
      }
    }
    &.Select--rtl {
      .Select-value {
        margin-left: 0;
        margin-right: 5px;
      }
      .Select-value-icon {
        border-right: none;
        border-left: 1px solid #c2e0ff;
        /* Fallback color for IE 8 */
        border-left: 1px solid rgba(0, 126, 255, 0.24);
      }
    }
    &.is-disabled {
      .Select-value {
        background-color: #fcfcfc;
        border: 1px solid #e3e3e3;
        color: ${props => props.selectedcolor};
      }
      .Select-value-icon {
        cursor: not-allowed;
        border-right: 1px solid #e3e3e3;
        &:hover,
        &:focus,
        &:active {
          background-color: #fcfcfc;
        }
      }
    }
  }

  @keyframes Select-animation-spin {
    to {
      transform: rotate(1turn);
    }
  }

  @-webkit-keyframes Select-animation-spin {
    to {
      -webkit-transform: rotate(1turn);
    }
  }
`

Select.defaultProps = {
  className: '',
  error: false,
  clearable: true,
}

Select.propTypes = {
  name: PropTypes.string.isRequired,
  onBlur: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  className: PropTypes.string,
  clearable: PropTypes.bool,
  error: PropTypes.bool,
  options: PropTypes.array.isRequired,
  value: PropTypes.object.isRequired,
}
