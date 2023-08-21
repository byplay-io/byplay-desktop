import {MemoryRouter as Router, Routes, Route} from 'react-router-dom';
import {Provider, useDispatch} from 'react-redux';
import './App.css';
import React, {useEffect} from 'react';
import {configuredStore} from './store';
import AuthenticateScreen from './Screens/Onboarding/Authenticate';
import SelectDirectory from './Screens/Onboarding/SelectDirectory';
import {AppRoute} from './Screens/routes';
import usePreferencesLoader from './hooks/preferencesLoader';
import {RecordingsList} from './Screens/Recordings/RecordingsList';
import RecordingLocalManager from './backend/RecordingLocalManager';
import {PluginsScreen} from './Screens/Plugins/PluginsScreen';
import {usePluginManifestsLoader} from './hooks/pluginManifestsLoader';
import {PluginDetailsScreen} from './Screens/Plugins/PluginDetailsScreen';
import Menu from './Screens/Menu/Menu';

const store = configuredStore();

function PreferencesLoader() {
  usePreferencesLoader();
  return null;
}

function PluginManifestsLoader() {
  usePluginManifestsLoader();
  return null;
}

function ProxyMainToDispatch() {
  const dispatch = useDispatch();
  useEffect(
    () => RecordingLocalManager.subscribeProxyToDispatch(dispatch),
    [dispatch],
  );
  return null;
}

export default function App() {
  return (
    <Provider store={store}>
      <div className="base-container">
        <Router>
          <PreferencesLoader />
          <PluginManifestsLoader />
          <ProxyMainToDispatch />
          <Menu />
          <Routes>
            {/* <Route path="/" element={<PluginsScreen />} /> */}
            <Route
              path={AppRoute.RECORDINGS_LIST}
              element={<RecordingsList />}
            />
            <Route
              path={AppRoute.ONBOARDING_SELECT_DIR}
              element={<SelectDirectory />}
            />
            <Route
              path={AppRoute.ONBOARDING_AUTHENTICATE}
              element={<AuthenticateScreen />}
            />
            <Route path={AppRoute.PLUGINS} element={<PluginsScreen />} />
            <Route
              path={AppRoute.PLUGIN_DETAILS}
              element={<PluginDetailsScreen />}
            />
          </Routes>
        </Router>
      </div>
    </Provider>
  );
}
