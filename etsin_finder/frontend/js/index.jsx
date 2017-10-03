import React from "react";
import ReactDOM from "react-dom";
import Footer from "./layout/footer";
import Header from "./layout/header";
import Content from "./layout/content";
require('bootstrap');

class App extends React.Component {
  render () {
    return (
    <div>
      <Header />
      <Content />
      <Footer />
    </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("content"));