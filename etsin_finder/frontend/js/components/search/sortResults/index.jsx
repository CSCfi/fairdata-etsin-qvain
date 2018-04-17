import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import Translate from 'react-translate-component'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import faSort from '@fortawesome/fontawesome-free-solid/faSort'

import ElasticQuery from 'Stores/view/elasticquery'
import { InvertedButton } from '../../general/button'

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
  }

  toggleList() {
    if (this.state.listToggle) {
      this.setState({
        listToggle: '',
      })
    } else {
      this.setState({
        listToggle: 'open',
      })
      this.selectOptions.children[0].focus()
    }
  }

  updateValue(event, value) {
    this[`option${this.state.value}`].classList.remove('active')
    this.setState(
      {
        value,
      },
      () => {
        ElasticQuery.updateSorting(this.state.value, this.props.history)
        ElasticQuery.queryES()
      }
    )
    event.target.classList.add('active')
    this.toggleList()
  }

  render() {
    return (
      <div className="sortResults">
        <div className="select">
          <div className="select-button">
            <InvertedButton
              className={`btn-select ${this.state.listToggle}`}
              onClick={this.toggleList}
              value={this.state.value}
              padding="0.5em 1em"
              noMargin
              ref={select => {
                this.selectButton = select
              }}
            >
              <Translate content={`search.sorting.${this.state.value}`} />{' '}
              <FontAwesomeIcon icon={faSort} aria-hidden="true" />
            </InvertedButton>
          </div>
          <div
            id="select-options"
            className={`options ${this.state.listToggle}`}
            ref={dropdown => {
              this.selectOptions = dropdown
            }}
          >
            {options.map(item => (
              <InvertedButton
                key={`sorting-${item}`}
                noMargin
                padding="0.5em 1em"
                className={`btn btn-select-options ${this.state.value === item ? 'active' : ''}`}
                onClick={e => {
                  this.updateValue(e, item)
                }}
                value={item}
                innerRef={value => {
                  this[`option${item}`] = value
                }}
                disabled={!this.state.listToggle}
              >
                <Translate content={`search.sorting.${item}`} />
              </InvertedButton>
            ))}
          </div>
        </div>
      </div>
    )
  }
}

export default withRouter(SortResults)
