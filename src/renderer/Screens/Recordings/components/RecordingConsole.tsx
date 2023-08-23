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

function NothingSelected() {
  return <div>But select something!</div>;
}

function RecordingInfo(props: {recording: IRecordingEntry}) {
  const {recording} = props;
  const {recordingManifest} = recording;
  const {recordingId, fps, framesCount, createdAtTimestamp, videoSettings} =
    recordingManifest;
  const {audioEnabled} = videoSettings ?? {audioEnabled: false};
  const {width, height} = videoSettings?.screenResolution ?? {
    width: 0,
    height: 0,
  };

  const date = useMemo(
    () => new Date(createdAtTimestamp).toLocaleString(),
    [createdAtTimestamp],
  );
  const duration = formatDuration(framesCount, fps);
  const resolution = width > 0 && height > 0 ? `${width}x${height}` : null;

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
    <div className="min-h-[60px] flex flex-col items-center mb-5">
      {status.state === RecordingState.NOT_STARTED && (
        <button
          type="button"
          onClick={download}
          className="bg-primary text-dark1 rounded-full hover:bg-primary-lighter font-bold cursor-pointer py-4 px-10"
        >
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

  return (
    <div className="w-full px-5 bg-dark3 pt-5" ref={parent}>
      <div key={recording.id} className="w-full">
        <RecordingStatusAndDownload status={status} recording={recording} />
        <div className="w-full flex flex-col items-center">
          <img
            src={recording.thumbnailUrl}
            className="max-h-[200px] max-w-[300px]"
            alt={recording.id}
          />
        </div>
        <RecordingInfo recording={recording} />
      </div>
    </div>
  );
}

export default function RecordingConsole() {
  const {recording, status} = useSelector(selectHighlightedRecording);
  console.log(recording, status);

  return (
    <div className="bg-dark3 rounded-xl ml-10 w-[300px] flex flex-col items-center">
      {recording == null ? (
        <NothingSelected />
      ) : (
        <RecordingDetails recording={recording} status={status} />
      )}
    </div>
  );
}
