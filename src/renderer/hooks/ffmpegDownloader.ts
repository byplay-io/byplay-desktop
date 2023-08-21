import {useDispatch, useSelector} from 'react-redux';
import {useCallback, useEffect} from 'react';
import {
  selectFfmpegPath,
  selectFfmpegProgress,
  setFFMPEGPath,
  setFFMPEGProgress,
} from '../state/ffmpeg';
import {IPCChannel} from '../../types/ipc';
import {sendRendererToMain} from '../../utils/ipcCommunication';

export default function useFFMPEGDownloader() {
  const dispatch = useDispatch();
  const ffmpegPath = useSelector(selectFfmpegPath);
  const ffmpegProgress = useSelector(selectFfmpegProgress);

  const started = ffmpegProgress !== null;

  useEffect(() => {});

  return useCallback(async () => {
    if (ffmpegPath !== null || started) {
      return;
    }

    dispatch(setFFMPEGProgress(1));

    const path = await sendRendererToMain<null, string>(
      IPCChannel.DOWNLOAD_FFMPEG,
      null,
    );

    dispatch(setFFMPEGPath(path));
  }, [dispatch, ffmpegPath, started]);
}
