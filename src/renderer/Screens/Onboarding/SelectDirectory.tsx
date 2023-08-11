import {useCallback} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import OnboardingHeader from './components/OnboardingHeader';
import {
  selectRecordingsDirPath,
  setRecordingsDirPath,
} from '../../state/recordings';
import {AppRoute} from '../routes';
import Preferences from '../../backend/Preferences';

function FolderSelector() {
  const dispatch = useDispatch();
  const dir = useSelector(selectRecordingsDirPath);
  const saveDir = useCallback(() => {
    const d = '/Users/vadim/projects/byplay/recordings';
    dispatch(setRecordingsDirPath(d));
    void Preferences.set('recordingsDir', d);
  }, [dispatch]);

  const navigate = useNavigate();
  const continueToApp = useCallback(() => {
    console.log('continueToApp');
    navigate(AppRoute.RECORDINGS_LIST);
  }, [navigate]);
  return (
    <div className="flex flex-row pt-10">
      <div className="bg-dark2 border-primary border-2 flex-grow font-mono flex-row p-4 rounded-2xl">
        /Users/vadim/projects/byplay/recordings
      </div>
      <button
        type="button"
        onClick={saveDir}
        className="bg-primary border-primary border-2 ml-5 flex-row py-4 mr-4 px-8 rounded-2xl text-center"
      >
        Select
      </button>
      <button
        disabled={dir === null}
        onClick={continueToApp}
        type="button"
        className="border-primary border-2 text-primary flex-row ml-12 py-4 px-8 rounded-full text-center"
      >
        Continue →
      </button>
    </div>
  );
}

export default function SelectDirectory() {
  return (
    <div className="flex flex-grow flex-col">
      <OnboardingHeader status="" />
      <div className="flex flex-col pt-10">
        <div className="helper-text font-bold">Step 2 of 2</div>
      </div>
      <h1>Select Directory</h1>
      <div className="w-1/2 leading-8">
        Select a directory where Byplay can store and extract the downloaded
        videos, FBX files and assets
        <div className="info text-light1">
          Remember, video frames take up a lot of space. Make sure you have{' '}
          <b>enough space on your hard drive</b>
        </div>
      </div>

      <FolderSelector />
    </div>
  );
}
