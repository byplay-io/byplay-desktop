import {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import {type Dispatch} from 'redux';
import {type Action} from '@reduxjs/toolkit';
import Preferences from '../backend/Preferences';
import {
  selectRecordingsDirPath,
  setRecordingsDirPath,
} from '../state/recordings';
import {selectAccessToken, setAccessToken} from '../state/auth';
import {selectFfmpegPath, setFFMPEGPath} from '../state/ffmpeg';
import {
  selectInstalledPluginVersions,
  setInstalledPluginVersion,
} from '../state/plugins';
import {startRoute} from '../Screens/routes';
import {PluginType} from '../../types/plugins';
import {type IPersistedPreferences} from '../../types/preferences';

function dispatchPreferences(
  prefs: IPersistedPreferences,
  dispatch: Dispatch<any>,
) {
  const {
    recordingsDir,
    accessToken,
    ffmpegPath,
    houdiniPluginVersion,
    blenderPluginVersion,
    c4dPluginVersion,
  } = prefs;
  if (recordingsDir !== null) {
    dispatch(setRecordingsDirPath(recordingsDir));
  }
  if (accessToken !== null) {
    dispatch(setAccessToken(accessToken));
  }
  if (ffmpegPath !== null) {
    dispatch(setFFMPEGPath(ffmpegPath));
  }
  if (houdiniPluginVersion !== null) {
    dispatch(
      setInstalledPluginVersion({
        pluginType: PluginType.Houdini,
        version: houdiniPluginVersion,
      }),
    );
  }
  if (blenderPluginVersion !== null) {
    dispatch(
      setInstalledPluginVersion({
        pluginType: PluginType.Blender,
        version: blenderPluginVersion,
      }),
    );
  }
  if (c4dPluginVersion !== null) {
    dispatch(
      setInstalledPluginVersion({
        pluginType: PluginType.Cinema4D,
        version: c4dPluginVersion,
      }),
    );
  }
}

function useAutoSaver(
  initPrefs: IPersistedPreferences | null,
  currentValue: string | null | undefined,
  keyName: keyof IPersistedPreferences,
) {
  const dispatch = useDispatch();
  useEffect(() => {
    if (initPrefs === null) {
      return;
    }
    if (
      initPrefs[keyName] === currentValue ||
      currentValue === null ||
      currentValue === undefined
    ) {
      return;
    }
    void Preferences.set(keyName, currentValue ?? null);
    console.log('Saved To Prefs', keyName, currentValue);
  }, [currentValue, dispatch, initPrefs, keyName]);
}

export default function usePreferencesLoader() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loaded, setLoaded] = useState(false);
  const [initPrefs, setInitPrefs] = useState<IPersistedPreferences | null>(
    null,
  );
  useEffect(() => {
    if (loaded) {
      return;
    }
    setLoaded(true);
    Preferences.read()
      .then((prefs) => {
        dispatchPreferences(prefs, dispatch);
        navigate(startRoute(prefs));
        setInitPrefs(prefs);
        return null;
      })
      .catch(console.error);
  }, [dispatch, loaded, navigate]);

  const accessToken = useSelector(selectAccessToken);
  useAutoSaver(initPrefs, accessToken, 'accessToken');
  const recordingsDir = useSelector(selectRecordingsDirPath);
  useAutoSaver(initPrefs, recordingsDir, 'recordingsDir');
  const ffmpegPath = useSelector(selectFfmpegPath);
  useAutoSaver(initPrefs, ffmpegPath, 'ffmpegPath');
  const pluginVersions = useSelector(selectInstalledPluginVersions);
  useAutoSaver(
    initPrefs,
    pluginVersions[PluginType.Houdini],
    'houdiniPluginVersion',
  );
  useAutoSaver(
    initPrefs,
    pluginVersions[PluginType.Blender],
    'blenderPluginVersion',
  );
  useAutoSaver(
    initPrefs,
    pluginVersions[PluginType.Cinema4D],
    'c4dPluginVersion',
  );

  return loaded;
}
