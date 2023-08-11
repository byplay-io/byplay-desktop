import {useEffect, useState} from 'react';
import {useDispatch} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import Preferences from '../backend/Preferences';
import {setRecordingsDirPath} from '../state/recordings';
import {setAccessToken} from '../state/auth';
import {setFFMPEGPath} from '../state/ffmpeg';
import {
  setInstalledBlenderPluginVersion,
  setInstalledC4DPluginVersion,
  setInstalledHoudiniPluginVersion,
} from '../state/plugins';
import {type IPersistedPreferences} from '../../types/preferences';
import {type AppRoute, startRoute} from '../Screens/routes';

export default function usePreferencesLoader() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    if (loaded) {
      return;
    }
    setLoaded(true);
    Preferences.read()
      .then((prefs) => {
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
          dispatch(setInstalledHoudiniPluginVersion(houdiniPluginVersion));
        }
        if (blenderPluginVersion !== null) {
          dispatch(setInstalledBlenderPluginVersion(blenderPluginVersion));
        }
        if (c4dPluginVersion !== null) {
          dispatch(setInstalledC4DPluginVersion(c4dPluginVersion));
        }

        navigate(startRoute(prefs));
        return null;
      })
      .catch(console.error);
  }, [dispatch, loaded, navigate]);

  return null;
}
