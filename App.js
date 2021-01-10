import React from 'react';

import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { createLogger } from 'redux-logger';

import NavigationService from './routes/NavigationService';

// Create Redux Stroe
import rootReducer from './reducers';
let store = createStore(
  rootReducer,
  applyMiddleware(
    thunk,
  ),
);

import AppContainer from './routes';

export default class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <AppContainer
          ref={navigatorRef => {
            NavigationService.setTopLevelNavigator(navigatorRef);
          }}
        />
      </Provider>
    );
  }
}
