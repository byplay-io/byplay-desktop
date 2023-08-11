import {MemoryRouter as Router, Routes, Route} from 'react-router-dom';
import {Provider, useDispatch} from 'react-redux';
import './App.css';
import {useEffect} from 'react';
import {configuredStore} from './store';
import AuthenticateScreen from './Screens/Onboarding/Authenticate';
import SelectDirectory from './Screens/Onboarding/SelectDirectory';
import {AppRoute} from './Screens/routes';
import usePreferencesLoader from './hooks/preferencesLoader';
import {RecordingsList} from './Screens/Recordings/RecordingsList';
import RecordingLocalManager from './backend/RecordingLocalManager';

const store = configuredStore();

function PreferencesLoader() {
  usePreferencesLoader();
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
          <ProxyMainToDispatch />
          <Routes>
            <Route path="/" element={<AuthenticateScreen />} />
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
          </Routes>
        </Router>
      </div>
    </Provider>
  );
}
