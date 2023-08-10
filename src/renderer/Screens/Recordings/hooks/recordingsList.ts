import {useCallback, useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useByplayAPI} from '../../../hooks/byplayAPI';
import {
  selectRecordingsList,
  selectRecordingStatuses,
  setRecordingsListFromServer,
  setRecordingStatusesBulk,
} from '../../../state/recordingsList';
import {type IRecordingEntry} from '../../../../types/byplayAPI';
import {selectFfmpegPath} from '../../../state/ffmpeg';
import {selectRecordingsDirPath} from '../../../state/recordings';
import RecordingLocalManager from '../../../backend/RecordingLocalManager';

function useRecordingLocalManagerFabric() {
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

export function useRecordingsList() {
  const [firstLoadStarted, setFirstLoadStarted] = useState(false);
  const [loading, setLoading] = useState(false);
  const byplayAPI = useByplayAPI();
  const dispatch = useDispatch();
  const statuses = useSelector(selectRecordingStatuses);

  const recordingLocalManagerFabric = useRecordingLocalManagerFabric();

  const checkStatuses = useCallback(
    (recordings: IRecordingEntry[]) => {
      const extracted: string[] = [];
      const notStarted: string[] = [];

      const promises = recordings
        .filter(({id}) => !(id in statuses))
        .map(async ({id}) => {
          const recordingManager = recordingLocalManagerFabric(id);
          if (await recordingManager.isExtracted()) {
            extracted.push(id);
          } else {
            notStarted.push(id);
          }
        });

      Promise.all(promises)
        .then(() => dispatch(setRecordingStatusesBulk({extracted, notStarted})))
        .catch(console.error);
    },
    [dispatch, recordingLocalManagerFabric, statuses],
  );

  const reloadList = useCallback(() => {
    setLoading(true);

    byplayAPI
      .recordingsList()
      .then((rl) => {
        const recordings = rl.response;
        if (recordings == null) {
          throw new Error('Recordings list is empty');
        }
        dispatch(setRecordingsListFromServer(recordings));
        checkStatuses(recordings.recordings);

        setLoading(false);
        return recordings;
      })
      .catch((e) => {
        setLoading(false);
        throw e;
      });
  }, [byplayAPI, checkStatuses, dispatch]);

  const recordingsList: IRecordingEntry[] =
    useSelector(selectRecordingsList) ?? [];

  useEffect(() => {
    if (!firstLoadStarted) {
      setFirstLoadStarted(true);
      reloadList();
    }
  }, [firstLoadStarted, reloadList]);

  return {loading, reloadList, recordingsList};
}
