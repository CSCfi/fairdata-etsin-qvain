import React, { Component } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'mobx-react';

import Footer from "./layout/footer";
import Header from "./layout/header";
import Content from "./layout/content";

import stores from './stores';

// Our translated strings
import translations from '../locale/data.js';

let localeData = translations();

addLocaleData([...en, ...fi]);

// Define user's language. Different browsers have the user locale defined
// on different fields on the `navigator` object, so we make sure to account
// for these different by checking all of them
const language = (navigator.languages && navigator.languages[0]) ||
                     navigator.language ||
                     navigator.userLanguage;

// Split locales with a region code
const languageWithoutRegionCode = language.toLowerCase().split(/[_-]+/)[0];

// Try full locale, try locale without region code, fallback to 'en'
const messages = localeData[languageWithoutRegionCode] || localeData[language] || localeData.en;

if (process.env.NODE_ENV !== 'production') {
  console.log('Looks like we are in development mode!');
}

class App extends Component {
  render () {
    return (
    <IntlProvider locale={language} messages={messages}>
      <Provider stores={stores}>
        <Router>
          <div>
            <Header />
            <Content />
            <Footer />
          </div>
        </Router>
      </Provider>
    </IntlProvider>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("content"));
