import 'whatwg-fetch';
import 'normalize.css/normalize.css';
import './styles/client.scss';
import state from './state';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'mobx-react';
import App from './containers/App';

// create root container
const rootDOM = document.createElement('div');
document.body.prepend(rootDOM);

// render App
render(App, state);

// handle webpack hot reload events
if (module.hot) {
  let NewApp = App;
  let newState = state;

  module.hot.accept();
  module.hot.accept('./state', () => {
    newState = require('./state').default;
    render(NewApp, newState);
  });
  module.hot.accept('./containers/App', () => {
    NewApp = require('./containers/App').default;
    render(NewApp, newState);
  });
}

// render function
function render (NewApp, newState) {
  ReactDOM.render(
    <Provider app={newState}>
      <NewApp app={newState} />
    </Provider>
    , rootDOM
  );
}
