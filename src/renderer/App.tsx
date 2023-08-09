import {MemoryRouter as Router, Routes, Route} from 'react-router-dom';
import {Provider} from 'react-redux';
import './App.css';
import {configuredStore} from './store';
import AuthenticateScreen from './Screens/Onboarding/Authenticate';
import SelectDirectory from './Screens/Onboarding/SelectDirectory';
import routes, {AppRoute} from './Screens/routes';
import usePreferencesLoader from './hooks/preferencesLoader';

const store = configuredStore();

function PreferencesLoader() {
  usePreferencesLoader();
  return null;
}

export default function App() {
  return (
    <Provider store={store}>
      <div className="base-container">
        <Router>
          <PreferencesLoader />
          <Routes>
            <Route path="/" element={<AuthenticateScreen />} />
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
