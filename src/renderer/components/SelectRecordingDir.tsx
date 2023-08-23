import {useDispatch, useSelector} from 'react-redux';
import {useCallback} from 'react';
import {useNavigate} from 'react-router-dom';
import {selectRecordingsDirPath} from '../state/recordings';
import {AppRoute} from '../Screens/routes';
import useChooseDirectory from '../hooks/directoryChooser';
import ChangeDirIcon from './assets/change-dir.svg';
import {selectFfmpegPath} from '../state/ffmpeg';

export function SelectRecordingDir(props: {withContinueButton?: boolean}) {
  const dir = useSelector(selectRecordingsDirPath);
  const ffmpegPath = useSelector(selectFfmpegPath);
  const chooseDir = useChooseDirectory();

  const navigate = useNavigate();
  const continueToApp = useCallback(() => {
    navigate(AppRoute.RECORDINGS_LIST);
  }, [navigate]);

  const {withContinueButton} = props;

  return (
    <div className="flex flex-row">
      <input className="select-record-dir-path" value={dir ?? ''} disabled />
      <button
        type="button"
        onClick={chooseDir}
        className="bg-primary hover:bg-primary-lighter text-dark1 items-center flex border-primary border-2 ml-5 flex-row py-4 mr-4 px-8 rounded-2xl text-center"
      >
        Select <img src={ChangeDirIcon} className="ml-2" />
      </button>
      {withContinueButton === true && (
        <button
          disabled={dir === null || ffmpegPath === null}
          onClick={continueToApp}
          type="button"
          className="border-primary border-2 text-primary flex-row ml-12 py-4 px-8 hover:bg-muted rounded-full text-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue →
        </button>
      )}
    </div>
  );
}
