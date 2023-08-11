import {useSelector} from 'react-redux';
import {useCallback, useMemo} from 'react';
import {selectFfmpegPath} from '../../../state/ffmpeg';
import {selectRecordingsDirPath} from '../../../state/recordings';
import RecordingLocalManager from '../../../backend/RecordingLocalManager';

export function useRecordingLocalManagerFabric() {
  const ffmpegPath = useSelector(selectFfmpegPath);
  const recordingDir = useSelector(selectRecordingsDirPath);
  return useCallback(
    (recordingId: string) => {
      if (ffmpegPath === null || recordingDir === null) {
        throw new Error('ffmpegPath or recordingDir is not set');
      }
      return new RecordingLocalManager(recordingId, ffmpegPath, recordingDir);
    },
    [ffmpegPath, recordingDir],
  );
}

export function useRecordingManager(recordingId: string) {
  const recordingLocalManagerFabric = useRecordingLocalManagerFabric();
  return useMemo(
    () => recordingLocalManagerFabric(recordingId),
    [recordingId, recordingLocalManagerFabric],
  );
}
