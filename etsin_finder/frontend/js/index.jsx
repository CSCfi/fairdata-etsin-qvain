import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router } from 'react-router-dom'
import Footer from "./layout/footer";
import Header from "./layout/header";
import Content from "./layout/content";
require('bootstrap');


  return (
    <Router>
      <div>
        <Header />
        <Content />
        <Footer />
      </div>
    </Router>
  )

ReactDOM.render(
    <FetchFromMetax />,
    document.getElementById("content")
);
