import {useSelector} from 'react-redux';
import {useAutoAnimate} from '@formkit/auto-animate/react';
import {useMemo} from 'react';
import {
  type IRecordingStatus,
  ProcessState,
  RecordingState,
  selectHighlightedRecording,
} from '../../../state/recordingsList';
import {useRecordingManager} from '../hooks/recordingManager';
import {type IRecordingEntry} from '../../../../types/byplayAPI';
import {useByplayAPI} from '../../../hooks/byplayAPI';
import CheckIcon from '../assets/check.svg';
import {formatBytesProgress} from '../../../../utils/formatBytes';
import formatDuration from '../../../../utils/formatDuration';
import formatResolution from '../../../../utils/formatResolution';
import PlayIcon from '../assets/play.svg';
import BlenderLogoIcon from '../assets/blender-logo-small.png';

function NothingSelected() {
  return <div className="text-muted pt-10">← Select a recording</div>;
}

function OpenIn(props: {recording: IRecordingEntry}) {
  const {recording} = props;
  const {recordingManifest} = recording;
  const {recordingId} = recordingManifest;
  const recordingManager = useRecordingManager(recordingId);
  const openBlender = () => {
    recordingManager.openInBlender();
  };

  const openDir = () => {
    recordingManager.openDir();
  };
  return (
    <div className="flex flex-row mt-5">
      <button
        className="border-primary flex-grow mr-5 border-2 rounded-xl px-5 py-2 hover:bg-primary hover:text-dark2"
        onClick={openDir}
      >
        Open Folder
      </button>
      <button
        className="border-primary border-2 rounded-xl px-2 py-2 hover:bg-primary hover:text-dark2"
        onClick={openBlender}
      >
        <img style={{height: 20}} src={BlenderLogoIcon} />
      </button>
    </div>
  );
}

function RecordingInfo(props: {recording: IRecordingEntry}) {
  const {recording} = props;
  const {recordingManifest} = recording;
  const {recordingId, fps, framesCount, createdAtTimestamp, videoSettings} =
    recordingManifest;
  const {audioEnabled} = videoSettings ?? {audioEnabled: false};
  const date = useMemo(
    () => new Date(createdAtTimestamp).toLocaleString(),
    [createdAtTimestamp],
  );
  const duration = formatDuration(framesCount, fps);
  const resolution = formatResolution(recordingManifest);

  return (
    <div className="recording-info-container">
      <div className="font-mono">{recordingId}</div>
      <div>{date}</div>
      <div>
        {resolution}
        {resolution !== null ? ', ' : ''}
        {audioEnabled ? 'has audio' : 'no audio'}
      </div>
      <div>
        {duration}{' '}
        <span className="text-light2">
          ({framesCount} frames @ {fps} fps)
        </span>
      </div>
    </div>
  );
}

function Progress(props: {status: IRecordingStatus; totalFrames: number}) {
  const {status, totalFrames} = props;
  if (status.downloadState === ProcessState.IN_PROGRESS) {
    const {downloadProgress} = status;
    if (downloadProgress === undefined) {
      return null;
    }
    return (
      <div className="flex flex-row justify-center">
        Downloading{' '}
        {formatBytesProgress(
          downloadProgress.total,
          downloadProgress.downloaded,
        )}
      </div>
    );
  }
  if (status.extractState === ProcessState.IN_PROGRESS) {
    const {extractedFrames} = status;
    if (extractedFrames === undefined) {
      return null;
    }
    return (
      <div className="flex flex-row justify-center">
        Extracting: <b>{Math.floor((extractedFrames / totalFrames) * 100)}%</b>
      </div>
    );
  }
}

function RecordingStatusAndDownload(props: {
  status: IRecordingStatus;
  recording: IRecordingEntry;
}) {
  const {status, recording} = props;
  const {recordingManifest} = recording;
  const {recordingId} = recordingManifest;
  const recordingManager = useRecordingManager(recordingId);
  const byplayAPI = useByplayAPI();
  const download = async () => {
    const links = await byplayAPI.recordingLinks(recordingId);
    if (links.response !== null) {
      await recordingManager.downloadAndExtract(links.response);
    }
  };

  return (
    <div
      className={`flex flex-col items-center mb-3 transition-all ${
        status.state === RecordingState.EXTRACTED ? '' : 'h-[70px]'
      }`}
    >
      {status.state === RecordingState.NOT_STARTED && (
        <button type="button" onClick={download} className="big-primary-button">
          Download
        </button>
      )}
      {status.state === RecordingState.EXTRACTED && (
        <div className="flex flex-row justify-center">
          Ready <img src={CheckIcon} className="w-5 h-5" alt="extracted" />{' '}
        </div>
      )}
      {status.state === RecordingState.IN_PROGRESS && (
        <Progress status={status} totalFrames={recordingManifest.framesCount} />
      )}
    </div>
  );
}

function RecordingDetails(props: {
  recording: IRecordingEntry;
  status: IRecordingStatus;
}) {
  const {recording, status} = props;

  const parent = useAutoAnimate()[0];

  const {recordingManifest} = recording;
  const {recordingId} = recordingManifest;
  const recordingManager = useRecordingManager(recordingId);

  const openVideo = () => {
    recordingManager.openVideo();
  };

  return (
    <div className="w-full px-5 pt-5" ref={parent}>
      <div key={recording.id} className="w-full">
        <RecordingStatusAndDownload status={status} recording={recording} />
        <div className="w-full flex flex-col items-center relative">
          <img
            src={recording.thumbnailUrl}
            className="max-h-[200px] max-w-[250px]"
            alt={recording.id}
          />
          {status.state === RecordingState.EXTRACTED && (
            <div
              className="absolute top-1/2 left-1/2 rounded-full bg-primary-opacity-20 hover:bg-primary-opacity-60 transition-all cursor-pointer"
              onClick={openVideo}
              style={{
                marginLeft: -25,
                marginTop: -25,
                width: 50,
                height: 50,
                paddingLeft: 16,
                paddingTop: 12,
              }}
            >
              <img src={PlayIcon} />
            </div>
          )}
        </div>
        <RecordingInfo recording={recording} />
        {status.state === RecordingState.EXTRACTED && (
          <OpenIn recording={recording} />
        )}
      </div>
    </div>
  );
}

export default function RecordingConsole() {
  const {recording, status} = useSelector(selectHighlightedRecording);

  return (
    <div className="bg-dark4 rounded-xl ml-5 mb-5 w-[280px] flex flex-col items-center">
      {recording == null ? (
        <NothingSelected />
      ) : (
        <RecordingDetails recording={recording} status={status} />
      )}
    </div>
  );
}
