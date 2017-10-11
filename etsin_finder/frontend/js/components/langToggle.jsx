import React, { Component } from 'react';
import counterpart from 'counterpart';
import '../../locale/translations';
import Store from '../stores/view/language';

export default class LangToggle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      language: counterpart.getLocale()
    }
    this.changeLang = this.changeLang.bind(this);
  }
  changeLang(e){
    counterpart.setLocale(e.target.innerHTML);
    Store.current_lang = e.target.innerHTML;
    this.setState({
      language: e.target.innerHTML
    });
  }

  render() {
    return (
        <button type="button" className="btn btn-transparent" onClick={this.changeLang}>
          {this.state.language == "fi" ? "en" : "fi"}
        </button>
    );
  }
}