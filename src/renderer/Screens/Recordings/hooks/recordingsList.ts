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
import {useRecordingLocalManagerFabric} from './recordingManager';

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

  useEffect(() => {
    if (!firstLoadStarted) {
      setFirstLoadStarted(true);
      reloadList();
    }
  }, [firstLoadStarted, reloadList]);

  return {loading, reloadList};
}
