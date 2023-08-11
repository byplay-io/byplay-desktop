import {useSelector} from 'react-redux';
import {useAutoAnimate} from '@formkit/auto-animate/react';
import {
  type IRecordingStatus,
  selectHighlightedRecording,
} from '../../../state/recordingsList';
import {useRecordingManager} from '../hooks/recordingManager';
import {type IRecordingEntry} from '../../../../types/byplayAPI';
import {useByplayAPI} from '../../../hooks/byplayAPI';

function NothingSeleted() {
  return <div>But select something!</div>;
}

function RecordingDetails(props: {
  recording: IRecordingEntry;
  status: IRecordingStatus;
}) {
  const {recording, status} = props;
  const recordingManager = useRecordingManager(recording.id);
  const byplayAPI = useByplayAPI();

  const download = async () => {
    const links = await byplayAPI.recordingLinks(recording.id);
    if (links.response !== null) {
      await recordingManager.downloadAndExtract(links.response);
    }
  };

  const [parent, enableAnimations] = useAutoAnimate();

  return (
    <div className="w-[200px] bg-dark3 ml-5" ref={parent}>
      <div key={recording.id}>
        <h2>{recording.id}</h2>
        {status.state}
        <button type="button" className="bg-dark2 m-5" onClick={download}>
          Download
        </button>
        <img src={recording.thumbnailUrl} alt={recording.id} />
      </div>
    </div>
  );
}

export default function RecordingConsole() {
  const {recording, status} = useSelector(selectHighlightedRecording);

  if (recording == null || status == null) {
    return <NothingSeleted />;
  }
  return <RecordingDetails recording={recording} status={status} />;
}
