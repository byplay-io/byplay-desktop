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
      className={`recording-grid-container m-5 flex-col bg-dark2 p-3 cursor-pointer ${
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
  const {fps, framesCount} = recordingManifest;
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
      className={`recording-list-container w-full flex flex-row p-2 mb-5 cursor-pointer ${
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
        <div className="text-muted">{duration}</div>
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
