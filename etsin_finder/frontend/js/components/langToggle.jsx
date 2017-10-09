import React, { Component } from 'react';

export default class LangToggle extends Component {
  changeLang(){
    console.log("Change the language");
  }

  render() {
    return (
        <button type="button" className="btn btn-transparent" onClick={this.changeLang}>
          EN
        </button>
    );
  }
}