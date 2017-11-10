import { AppContainer } from 'react-hot-loader'
import React from 'react'
import ReactDOM from 'react-dom'

import App, { App as NextApp } from './app'

ReactDOM.render(
  <AppContainer>
    <App />
  </AppContainer>,
  document.getElementById('content'),
);

if (module.hot) {
  module.hot.accept('./app', () => {
    ReactDOM.render(<AppContainer><NextApp /></AppContainer>, document.getElementById('content'));
  });
}
