/* eslint react/jsx-props-no-spreading: off */
import React from 'react';
import { Switch, Route } from 'react-router-dom';
import routes from './constants/routes.json';
import App from './containers/App';
import HomePage from './containers/HomePage';
import SetupPage from './containers/SetupPage';
import RecordingsListPage from './containers/RecordingsListPage';
import PluginsPage from './containers/PluginsPage';
import NavigationMenu from './components/NavigationMenu';
import { Box } from 'rebass';
import SignOutContainer from './features/auth/SignOutContainer';
import SupportPage from './containers/SupportPage';
import PreferencesLoader from './components/PreferencesLoader';

export default function Routes() {
  return (
    <App>
      <PreferencesLoader />
      <NavigationMenu />
      <Box m={2}>
        <Switch>
          <Route exact path={routes.SETUP} component={SetupPage} />
          <Route exact path={routes.HOME} component={HomePage} />
          <Route exact path={routes.RECORDINGS_LIST} component={RecordingsListPage} />
          <Route exact path={routes.PLUGINS} component={PluginsPage} />
          <Route exact path={routes.SIGN_OUT} component={SignOutContainer} />
          <Route exact path={routes.SUPPORT} component={SupportPage} />
        </Switch>
      </Box>
    </App>
  );
}
