import {MemoryRouter as Router, Routes, Route} from 'react-router-dom';
import {Provider, useDispatch} from 'react-redux';
import './App.css';
import React, {useEffect} from 'react';
import {configuredStore} from './store';
import usePreferencesLoader from './hooks/preferencesLoader';
import RecordingLocalManager from './backend/RecordingLocalManager';
import {usePluginManifestsLoader} from './hooks/pluginManifestsLoader';
import Menu from './Screens/Menu/Menu';
import AppRoutes from './AppRoutes';

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

function FFMpegDownloader() {
  useEffect(() => {}, []);
  return null;
}

export default function App() {
  return (
    <Provider store={store}>
      <div className="base-container">
        <Router>
          <PreferencesLoader />
          <PluginManifestsLoader />
          <FFMpegDownloader />
          <ProxyMainToDispatch />
          <Menu />
          <AppRoutes />
        </Router>
      </div>
    </Provider>
  );
}
