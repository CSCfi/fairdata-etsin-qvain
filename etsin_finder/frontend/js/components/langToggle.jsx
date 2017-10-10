import React, { Component } from 'react';
import counterpart from 'counterpart';
import '../../locale/translations';

export default class LangToggle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      language: counterpart.getLocale()
    }
    this.changeLang = this.changeLang.bind(this);
  }
  changeLang(e){
    console.log(e.target.innerHTML);
    counterpart.setLocale((e.target.innerHTML == "fi" ) ? "fi" : "en");
    this.setState({
      language: (e.target.innerHTML == "fi" ? "en" : "fi")
    });
  }

  render() {
    return (
        <button type="button" className="btn btn-transparent" onClick={this.changeLang}>
          {this.state.language == "en" ? "en" : "fi"}
        </button>
    );
  }
}