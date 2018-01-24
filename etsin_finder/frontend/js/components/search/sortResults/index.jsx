import React, { Component } from 'react'

export default class SortResults extends Component {
  constructor(props) {
    super(props)
    this.state = {
      value: 'best',
      name: 'Best Match',
      listToggle: '',
    }
    this.sort = this.sort.bind(this)
    this.toggleList = this.toggleList.bind(this)
    this.updateValue = this.updateValue.bind(this)
  }

  sort(event) {
    this.props.sorting(event.target.value)
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

  updateValue(event) {
    this[`option${this.state.value}`].classList.remove('active')
    this.setState({
      value: event.target.value,
      name: event.target.textContent,
    })
    event.target.classList.add('active');
    this.toggleList()
  }

  render() {
    return (
      <div className="sortResults">
        <div className="select">
          <div className="select-button">
            <button
              className={`btn btn-select ${this.state.listToggle}`}
              onClick={this.toggleList}
              value={this.state.value}
              ref={(select) => { this.selectButton = select }}
            >
              {this.state.name} <i className="fa fa-sort" aria-hidden="true" />
            </button>
          </div>
          <div
            id="select-options"
            className={`options ${this.state.listToggle}`}
            ref={(options) => { this.selectOptions = options }}
          >
            <button
              className="btn btn-select-options active"
              onClick={this.updateValue}
              value="best"
              ref={(value) => { this.optionbest = value }}
              disabled={!this.state.listToggle}
            >
              Best Match
            </button>
            <button
              className="btn btn-select-options"
              onClick={this.updateValue}
              value="dateA"
              ref={(value) => { this.optiondateA = value }}
              disabled={!this.state.listToggle}
            >
              Date ascending
            </button>
            <button
              className="btn btn-select-options"
              onClick={this.updateValue}
              value="dateD"
              ref={(value) => { this.optiondateD = value }}
              disabled={!this.state.listToggle}
            >
              Date descending
            </button>
          </div>
        </div>
        {/* <select onChange={this.sort}>
          <option value="">Best match</option>
          <option value="date-a">Date ascending</option>
          <option value="date-d">Date descending</option>
        </select> */}
      </div>
    );
  }
}
