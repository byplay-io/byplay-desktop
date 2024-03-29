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
import {SelectRecordingDir} from '../../components/SelectRecordingDir';
import {selectFfmpegPath, selectFfmpegProgress} from '../../state/ffmpeg';

export default function SelectDirectory() {
  const dirPath = useSelector(selectRecordingsDirPath);
  const ffmpegPath = useSelector(selectFfmpegPath);
  const ffmpegProgress = useSelector(selectFfmpegProgress);
  return (
    <div className="flex flex-grow flex-col mx-10">
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

      <SelectRecordingDir withContinueButton />

      {dirPath !== null && ffmpegPath === null && (
        <div className="mt-10 text-red">
          Downloading FFMPEG: {ffmpegProgress}%, please wait for it to complete
        </div>
      )}
    </div>
  );
}
