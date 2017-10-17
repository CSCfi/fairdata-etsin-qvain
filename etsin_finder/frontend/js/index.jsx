import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'mobx-react';

import Footer from './layout/footer';
import Header from './layout/header';
import Content from './layout/content';

import Stores from './stores';

console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === 'test') {
  console.log('We are in test');
} else if (process.env.NODE_ENV === 'development') {
  console.log('We are in development');
} else if (process.env.NODE_ENV !== 'production') {
  console.log('Looks like we are in development mode!');
}

class App extends Component {
  render() {
    return (
      <Provider Stores={Stores}>
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

ReactDOM.render(<App />, document.getElementById('content'));
