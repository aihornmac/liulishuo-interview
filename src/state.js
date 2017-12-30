import AppState from './models/AppState';

const appState = new AppState();

export default appState;

if (module.hot) {
  module.hot.accept();
  module.hot.dispose(() => {
    appState.destroy();
  });
}
