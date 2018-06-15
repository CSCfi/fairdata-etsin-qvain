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
import { withRouter } from 'react-router-dom'
import Translate from 'react-translate-component'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import faSortAmountDown from '@fortawesome/fontawesome-free-solid/faSortAmountDown'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import ElasticQuery from '../../../stores/view/elasticquery'
import Accessibility from '../../../stores/view/accessibility'
import { InvertedButton } from '../../general/button'

// available options, they are also checked in ElasticQuery store
const options = ['best', 'dateD', 'dateA']

class SortResults extends Component {
  constructor(props) {
    super(props)

    this.state = {
      value: ElasticQuery.sorting,
      listToggle: '',
    }
    this.toggleList = this.toggleList.bind(this)
    this.updateValue = this.updateValue.bind(this)
    // create option references so that we can move focus inside
    for (let i = 0; i < options.length; i += 1) {
      this[`option${i}`] = React.createRef()
    }
  }

  toggleList = () => {
    if (this.state.listToggle) {
      this.setState({
        listToggle: '',
      })
    } else {
      this.setState(
        {
          listToggle: 'open',
        },
        () => {
          if (Accessibility.userIsTabbing) {
            this.option0.current.focus()
          }
        }
      )
    }
  }

  updateValue(event, value) {
    this.setState(
      {
        value,
      },
      () => {
        ElasticQuery.updateSorting(this.state.value, this.props.history)
        ElasticQuery.queryES()
      }
    )
    this.toggleList()
  }

  render() {
    return (
      <SortResultsContainer>
        <SelectButton>
          <InvertedButton
            className={`btn-select ${this.state.listToggle} ${
              this.state.listToggle ? 'active' : ''
            }`}
            onClick={this.toggleList}
            value={this.state.value}
            padding="0.5em 1em"
            noMargin
            ref={select => {
              this.selectButton = select
            }}
          >
            <FontAwesomeIcon icon={faSortAmountDown} aria-hidden="true" />{' '}
            <Translate content="search.sorting.sort" />
          </InvertedButton>
        </SelectButton>
        <SelectOptionsContainer>
          <SelectOptions id="select-options" className={this.state.listToggle}>
            <div>
              {options.map((item, i) => (
                <InvertedButton
                  innerRef={this[`option${i}`]}
                  key={`sorting-${item}`}
                  noMargin
                  padding="0.5em 1em"
                  className={`btn-select-options ${this.state.value === item ? 'active' : ''}`}
                  onClick={e => {
                    this.updateValue(e, item)
                  }}
                  value={item}
                  // innerRef={value => {
                  //   this[`option${item}`] = value
                  // }}
                  disabled={!this.state.listToggle}
                >
                  <Translate content={`search.sorting.${item}`} />
                </InvertedButton>
              ))}
            </div>
          </SelectOptions>
        </SelectOptionsContainer>
      </SortResultsContainer>
    )
  }
}

export default withRouter(SortResults)

const SelectOptionsContainer = styled.div`
  position: relative;
`

const SelectOptions = styled.div`
  background-color: white;
  position: absolute;
  right: 0;
  z-index: 10;
  border: 0px solid ${props => props.theme.color.primary};
  border-radius: 5px;
  max-height: 0px;
  width: max-content;
  overflow: hidden;
  transition: max-height 0.5s ease, border 0.3s ease 0.4s;
  margin-top: 0.5em;
  & > div {
    display: flex;
    flex-direction: column;
  }
  &.open {
    transition: max-height 0.5s ease, border 0.3s ease;
    max-height: 150px;
    border: 2px solid ${props => props.theme.color.primary};
  }
  button {
    text-align: right;
    border-radius: 0;
    border: none;
    &:focus {
      text-decoration: underline;
    }
  }
`

const SelectButton = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  width: max-content;
  button {
    position: relative;
    &.open {
      border-radius: 5px;
      &::after {
        content: '';
        position: absolute;
        bottom: -0.5em;
        right: calc(50% - 0.5em);
        display: 'block';
        width: 0.5em;
        border-top: 0.5em solid ${props => props.theme.color.primary};
        border-left: 0.5em solid transparent;
        border-right: 0.5em solid transparent;
      }
      &:hover,
      &:focus {
        background-color: ${props => props.theme.color.primary};
      }
    }
  }
`

SortResults.propTypes = {
  history: PropTypes.object.isRequired,
}

const SortResultsContainer = styled.div`
  float: right;
`
