import {useCallback} from 'react';
import {useDispatch} from 'react-redux';
import {sendRendererToMain} from '../../utils/ipcCommunication';
import {IPCChannel} from '../../types/ipc';
import {setRecordingsDirPath} from '../state/recordings';

async function askDir() {
  return sendRendererToMain<null, string | null>(
    IPCChannel.CHOOSE_DIRECTORY,
    null,
  );
}

export default function useChooseDirectory() {
  const dispatch = useDispatch();
  return useCallback(async () => {
    const selected = await askDir();
    if (selected !== null) {
      dispatch(setRecordingsDirPath(selected));
    }
  }, [dispatch]);
}
