import React from "react";
import ReactDOM from "react-dom";
import Footer from "./footer/footer";
import Header from "./header/header";
import Content from "./content/content";
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