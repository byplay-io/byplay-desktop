import {useEffect} from 'react';
import {useRecordingsList} from './hooks/recordingsList';

export function RecordingsList() {
  const {loading, recordingsList, reloadList} = useRecordingsList();

  return (
    <div>
      <h1>Recordings</h1>
      {loading ? <div>Loading...</div> : null}
      <div>
        {recordingsList.map((recording) => (
          <div key={recording.id}>{recording.id}</div>
        ))}
      </div>
    </div>
  );
}
