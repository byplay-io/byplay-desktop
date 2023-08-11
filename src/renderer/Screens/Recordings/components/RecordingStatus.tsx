import {useSelector} from 'react-redux';
import {
  RecordingNotStartedStatus,
  selectRecordingStatuses,
} from '../../../state/recordingsList';
import {formatBytes, formatBytesProgress} from '../../../../utils/formatBytes';

export function RecordingStatus(props: {recordingId: string}) {
  const statuses = useSelector(selectRecordingStatuses);
  const {recordingId} = props;
  const status =
    recordingId in statuses ? statuses[recordingId] : RecordingNotStartedStatus;

  return (
    <div className="bg-light1 text-dark1 absolute top-0">
      {status.state} {status.extractedFrames}{' '}
      {status.downloadProgress != null &&
        formatBytesProgress(
          status.downloadProgress.total,
          status.downloadProgress.downloaded,
        )}
    </div>
  );
}
