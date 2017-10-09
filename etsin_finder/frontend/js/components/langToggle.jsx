import React, { Component } from 'react';
import { observer } from 'mobx-react';

export default class LangToggle extends Component {
  changeLang(){
    console.log("Change the language");
    Locale.language = (Locale.language == "fi_FI" ) ? "en_EN" : "fi_FI";
    console.log(Locale.messages);
  }

  render() {
    return (
        <button type="button" className="btn btn-transparent" onClick={this.changeLang}>
          {Locale.langShort}
        </button>
    );
  }
}