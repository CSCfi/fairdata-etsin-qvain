import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router } from 'react-router-dom';
import { IntlProvider, addLocaleData } from 'react-intl';
import { observer } from 'mobx-react';
import { UIStore } from './stores/view/language';
import en from 'react-intl/locale-data/en';
import fi from 'react-intl/locale-data/fi';

import Footer from "./layout/footer";
import Header from "./layout/header";
import Content from "./layout/content";

addLocaleData([...en, ...fi]);

// Define user's language. Different browsers have the user locale defined
// on different fields on the `navigator` object, so we make sure to account
// for these different by checking all of them
const language = (navigator.languages && navigator.languages[0]) ||
                     navigator.language ||
                     navigator.userLanguage;

Locale.language = language;

if (process.env.NODE_ENV !== 'production') {
  console.log('Looks like we are in development mode!');
}

@observer class App extends React.Component {
  render () {
    return (
      <IntlProvider locale={Locale.language} messages={Locale.messages}>
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