import React, { Component } from 'react';
import counterpart from 'counterpart';
import '../../../../locale/translations';
import Locale from '../../../stores/view/language';

export default class LangToggle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      language: counterpart.getLocale(),
    };
    this.changeLang = this.changeLang.bind(this);
  }
  changeLang() {
    Locale.toggleLang()
    this.setState({
      language: Locale.currentLang,
    });
  }

  render() {
    return (
      <button type="button" className="btn btn-transparent" onClick={this.changeLang}>
        {this.state.language === 'fi' ? 'en' : 'fi'}
      </button>
    );
  }
}
