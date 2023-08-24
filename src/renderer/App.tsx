import {MemoryRouter as Router} from 'react-router-dom';
import {Provider, useDispatch, useSelector} from 'react-redux';
import './App.css';
import React, {useEffect} from 'react';
import * as Sentry from '@sentry/electron';
import {configuredStore} from './store';
import usePreferencesLoader from './hooks/preferencesLoader';
import RecordingLocalManager from './backend/RecordingLocalManager';
import {usePluginManifestsLoader} from './hooks/pluginManifestsLoader';
import Menu from './Screens/Menu/Menu';
import AppRoutes from './AppRoutes';
import {subscribeRenderFromMain} from '../utils/ipcCommunication';
import {type MessageFFMPEGDownloadStatus} from '../types/ipc';
import {
  selectFfmpegPath,
  selectFfmpegProgress,
  setFFMPEGProgress,
} from './state/ffmpeg';
import useFFMPEGDownloader from './hooks/ffmpegDownloader';

const store = configuredStore();

function PreferencesLoader({children}: {children: React.ReactNode}) {
  const loaded = usePreferencesLoader();
  if (!loaded) {
    return null;
  }
  return children;
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
  const dispatch = useDispatch();
  const ffmpegPath = useSelector(selectFfmpegPath);
  const ffmpegProgress = useSelector(selectFfmpegProgress);
  useEffect(() => {
    return subscribeRenderFromMain<MessageFFMPEGDownloadStatus>(
      'ffmpeg-download-progress',
      ({total, downloaded}) => {
        const percentage = Math.floor((downloaded / total) * 100);
        console.log('ffmpeg download progress', percentage);
        dispatch(setFFMPEGProgress(percentage));
      },
    );
  }, [dispatch]);

  const needToDownload = ffmpegPath === null && ffmpegProgress === null;

  const downloadFfmpeg = useFFMPEGDownloader();

  console.log({ffmpegPath, ffmpegProgress, needToDownload});

  useEffect(() => {
    if (needToDownload) {
      console.log('need to download ffmpeg');
      void downloadFfmpeg();
    }
  }, [downloadFfmpeg, needToDownload]);
  return null;
}

Sentry.init({
  dsn: 'https://e3d32ad930b7730eee863df272c57bd1@o244219.ingest.sentry.io/4505759397052416',
});

export default function App() {
  return (
    <Provider store={store}>
      <div className="base-container">
        <Router>
          <PreferencesLoader>
            <PluginManifestsLoader />
            <FFMpegDownloader />
            <ProxyMainToDispatch />
            <Menu />
            <AppRoutes />
          </PreferencesLoader>
        </Router>
      </div>
    </Provider>
  );
}
