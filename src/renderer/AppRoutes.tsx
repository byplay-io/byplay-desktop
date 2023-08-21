import {Route, Routes} from 'react-router-dom';
import React from 'react';
import {AppRoute} from './Screens/routes';
import {RecordingsList} from './Screens/Recordings/RecordingsList';
import SelectDirectory from './Screens/Onboarding/SelectDirectory';
import AuthenticateScreen from './Screens/Onboarding/Authenticate';
import {PluginsScreen} from './Screens/Plugins/PluginsScreen';
import {PluginDetailsScreen} from './Screens/Plugins/PluginDetailsScreen';
import HelpSupportScreen from './Screens/HelpSupport/HelpSupportScreen';
import SettingsScreen from './Screens/Settings/SettingsScreen';
import StartPage from './Screens/StartPage/StartPage';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<StartPage />} />
      <Route path={AppRoute.RECORDINGS_LIST} element={<RecordingsList />} />
      <Route
        path={AppRoute.ONBOARDING_SELECT_DIR}
        element={<SelectDirectory />}
      />
      <Route
        path={AppRoute.ONBOARDING_AUTHENTICATE}
        element={<AuthenticateScreen />}
      />
      <Route path={AppRoute.PLUGINS} element={<PluginsScreen />} />
      <Route path={AppRoute.PLUGIN_DETAILS} element={<PluginDetailsScreen />} />
      <Route path={AppRoute.HELP_SUPPORT} element={<HelpSupportScreen />} />
      <Route path={AppRoute.SETTINGS} element={<SettingsScreen />} />
    </Routes>
  );
}
