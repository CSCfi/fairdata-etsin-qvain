import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router } from 'react-router-dom'
import Footer from "./layout/footer";
import Header from "./layout/header";
import Content from "./layout/content";
require('bootstrap');

class App extends React.Component {
  render () {
    return (
    <Router>
      <div>
        <Header />
        <Content />
        <Footer />
      </div>
    </Router>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("content"));