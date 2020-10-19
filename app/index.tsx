import React, { Fragment } from 'react';
import { render } from 'react-dom';
import { AppContainer as ReactHotAppContainer } from 'react-hot-loader';
import { configuredStore, history } from './store';
import './app.global.css';
import Downloader from './backend/Downloader';
import ByplayAPIClient from './backend/ByplayAPIClient';
import { selectAccessToken } from './features/auth/authSlice';
import { ipcRenderer } from 'electron';
import { Analytics, AnalyticsUserEventType } from './backend/Amplitude';
import * as Sentry from "@sentry/electron";

Sentry.init({ dsn: "https://e5767db8a9e24a48b46e23d0c5869613@o244219.ingest.sentry.io/5469203" });

const store = configuredStore();

const AppContainer = process.env.PLAIN_HMR ? Fragment : ReactHotAppContainer;

Downloader.subscribeRenderer()

ipcRenderer.on('appUpdater', (_event, eventType) => {
  if(eventType == 'updateDowloaded') {
    Analytics.registerUserEvent(AnalyticsUserEventType.APP_UPDATE_DOWNLOADED)
    alert("An update has been downloaded. Restart the app to install it")
  }
})

ByplayAPIClient.instance = new ByplayAPIClient(() => selectAccessToken(store.getState()))
Analytics.setup()

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
