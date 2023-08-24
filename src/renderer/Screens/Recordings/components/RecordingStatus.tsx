import {useSelector} from 'react-redux';
import {
  RecordingNotStartedStatus,
  selectRecordingStatuses,
  RecordingState,
} from '../../../state/recordingsList';
import {formatBytesProgress} from '../../../../utils/formatBytes';
import CloudIcon from '../assets/cloud.svg';
import CheckIcon from '../assets/check.svg';
import CloudArrowDownIcon from '../assets/cloud-arrow-down.svg';

const IconByStatus: Record<RecordingState, string> = {
  [RecordingState.NOT_STARTED]: CloudIcon,
  [RecordingState.IN_PROGRESS]: CloudArrowDownIcon,
  [RecordingState.EXTRACTED]: CheckIcon,
};

export default function RecordingStatus(props: {recordingId: string}) {
  const statuses = useSelector(selectRecordingStatuses);
  const {recordingId} = props;
  const status =
    recordingId in statuses ? statuses[recordingId] : RecordingNotStartedStatus;

  return (
    <div className="absolute top-0 right-0">
      <img src={IconByStatus[status.state]} alt={status.state} width={20} />
      {/* {status.state} {status.extractedFrames}{' '} */}
      {/* {status.downloadProgress != null && */}
      {/*   formatBytesProgress( */}
      {/*     status.downloadProgress.total, */}
      {/*     status.downloadProgress.downloaded, */}
      {/*   )} */}
    </div>
  );
}
