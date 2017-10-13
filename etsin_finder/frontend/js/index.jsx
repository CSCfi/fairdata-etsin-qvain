import React, { Component } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'mobx-react';

import Footer from "./layout/footer";
import Header from "./layout/header";
import Content from "./layout/content";

import stores from './stores';

class App extends Component {
  render () {
    return (
      <Provider stores={stores}>
        <Router>
          <div>
            <Header />
            <Content />
            <Footer />
          </div>
        </Router>
      </Provider>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("content"));
