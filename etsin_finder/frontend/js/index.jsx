import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router } from 'react-router-dom';
import { IntlProvider, addLocaleData } from 'react-intl';
import en from 'react-intl/locale-data/en';
import fi from 'react-intl/locale-data/fi';

import Footer from "./layout/footer";
import Header from "./layout/header";
import Content from "./layout/content";

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

class App extends React.Component {
  render () {
    return (
    <IntlProvider locale={language} messages={messages}>
      <Router>
        <div>
          <Header />
          <Content />
          <Footer />
        </div>
      </Router>
    </IntlProvider>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("content"));