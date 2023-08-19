import {type IPersistedPreferences} from '../../types/preferences';

export enum AppRoute {
  ONBOARDING_AUTHENTICATE = '/onboarding/authenticate',
  ONBOARDING_SELECT_DIR = '/onboarding/select-directory',
  RECORDINGS_LIST = '/recordings-list',
  PLUGINS = '/plugins',
  PLUGIN_DETAILS = '/plugin/:pluginId',
}

export function startRoute(prefs: IPersistedPreferences): AppRoute {
  if (prefs.accessToken === null) {
    return AppRoute.ONBOARDING_AUTHENTICATE;
  }
  if (prefs.recordingsDir === null) {
    return AppRoute.ONBOARDING_SELECT_DIR;
  }
  return AppRoute.PLUGINS;
}
