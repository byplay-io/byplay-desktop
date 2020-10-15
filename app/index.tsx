import React, { Fragment } from 'react';
import { render } from 'react-dom';
import { AppContainer as ReactHotAppContainer } from 'react-hot-loader';
import { history, configuredStore } from './store';
import './app.global.css';
import Downloader from './backend/Downloader';
import ByplayAPIClient from './backend/ByplayAPIClient';
import { selectAccessToken } from './features/auth/authSlice';

const store = configuredStore();

const AppContainer = process.env.PLAIN_HMR ? Fragment : ReactHotAppContainer;

Downloader.subscribeRenderer()

ByplayAPIClient.instance = new ByplayAPIClient(() => selectAccessToken(store.getState()))

document.addEventListener('DOMContentLoaded', () => {
  // eslint-disable-next-line global-require
  const Root = require('./containers/Root').default;
  render(
    <AppContainer>
      <Root store={store} history={history} />
    </AppContainer>,
    document.getElementById('root')
  );
});
