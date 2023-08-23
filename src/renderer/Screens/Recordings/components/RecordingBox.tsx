import {useDispatch, useSelector} from 'react-redux';
import {useCallback, useMemo} from 'react';
import {
  type IRecordingEntry,
  type RecordingManifestData,
} from '../../../../types/byplayAPI';
import {
  selectHighlightedRecordingId,
  selectRecordingsView,
  setHighlightedRecordingId,
} from '../../../state/recordingsList';
import formatDuration from '../../../../utils/formatDuration';
import {RecordingStatus} from './RecordingStatus';
import AudioEnabledIcon from '../assets/audio-enabled.svg';
import AudioDisabledIcon from '../assets/audio-disabled.svg';

function RecordingBoxGrid(props: {
  id: string;
  thumbnailUrl: string;
  selected: boolean;
}) {
  const {id, thumbnailUrl, selected} = props;
  const croppedid = id;
  const dispatch = useDispatch();
  const setSelected = useCallback(() => {
    dispatch(setHighlightedRecordingId(id));
  }, [id, dispatch]);
  return (
    <div
      className={`recording-container grid m-5 flex-col bg-dark2 p-3 cursor-pointer ${
        selected ? 'selected' : ''
      }`}
      onClick={setSelected}
    >
      <div className="recording-grid-image mb-2 relative">
        <img
          src={thumbnailUrl}
          className="object-contain recording-grid-image"
          alt={id}
        />
        <RecordingStatus recordingId={id} />
      </div>
      <div className="">
        <span className="text-xs">{croppedid.slice(0, 8)}</span>
        <span className="">{croppedid.slice(8, id.length)}</span>
      </div>
    </div>
  );
}

function RecordingBoxList(props: {
  id: string;
  thumbnailUrl: string;
  selected: boolean;
  recordingManifest: RecordingManifestData;
}) {
  const {id, recordingManifest, selected, thumbnailUrl} = props;
  const {fps, framesCount, videoSettings} = recordingManifest;
  console.log(videoSettings);
  const {audioEnabled} = videoSettings;
  const resolution =
    videoSettings?.screenResolution != null &&
    videoSettings?.screenResolution.width > 0 &&
    `${videoSettings?.screenResolution.width}x${videoSettings?.screenResolution.height}`;
  const duration = useMemo(
    () => formatDuration(framesCount, fps),
    [framesCount, fps],
  );

  const dispatch = useDispatch();
  const setSelected = useCallback(() => {
    dispatch(setHighlightedRecordingId(id));
  }, [id, dispatch]);
  return (
    <div
      className={`recording-container list hover:bg-dark1 w-full flex flex-row p-2 mb-5 cursor-pointer ${
        selected ? 'selected' : ''
      }`}
      onClick={setSelected}
    >
      <div className="recording-list-image bg-dark2 relative">
        <img
          src={thumbnailUrl}
          className="object-contain recording-list-image"
          alt={id}
        />
        <RecordingStatus recordingId={id} />
      </div>
      <div className="ml-4">
        <div className="flex flex-col py-2">
          <div className="text-xl text-light1">{id}</div>
        </div>
        <div className="flex flex-row">
          <div className="video-info-point">{duration}</div>
          <div className="video-info-point">{fps}FPS</div>
          <div className="video-info-point">
            <img
              className="w-6 h-6"
              src={audioEnabled === true ? AudioEnabledIcon : AudioDisabledIcon}
            />
          </div>
          {resolution !== false && (
            <div className="video-info-point">{resolution}</div>
          )}
        </div>
      </div>
    </div>
  );
}

export function RecordingBox(props: IRecordingEntry) {
  const view = useSelector(selectRecordingsView);
  const {id, recordingManifest, thumbnailUrl} = props;

  const selected = useSelector(selectHighlightedRecordingId);

  if (view === 'grid') {
    return (
      <RecordingBoxGrid
        id={id}
        thumbnailUrl={thumbnailUrl}
        selected={id === selected}
      />
    );
  }
  return (
    <RecordingBoxList
      id={id}
      thumbnailUrl={thumbnailUrl}
      selected={id === selected}
      recordingManifest={recordingManifest}
    />
  );
}
