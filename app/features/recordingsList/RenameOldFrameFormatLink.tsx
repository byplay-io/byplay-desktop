import React, { useEffect, useState } from 'react';
import { Link } from 'rebass';
import RecordingLocalManager from '../../backend/RecordingLocalManager';
import { useStore } from 'react-redux';
import ActivityIndicator from '../../utils/ActivityIndicator';

enum ExtractStatus {
  EXTRACTED_OLD,
  EXTRACTED_NEW,
  IN_PROGRESS,
}

export default function RenameOldFrameFormatLink(props: {recordingId: string}) {
  let store = useStore()
  let [status, setStatus] = useState<ExtractStatus>(ExtractStatus.EXTRACTED_NEW)
  let m = new RecordingLocalManager(props.recordingId, store)

  useEffect(() => {
    if(m.isOldExtracted()) {
      setStatus(ExtractStatus.EXTRACTED_OLD)
    }
  }, [])

  const rename = async () => {
    setStatus(ExtractStatus.IN_PROGRESS)
    await m.renameOldFramesToNew()
    setStatus(ExtractStatus.EXTRACTED_NEW)
  }

  if(status == ExtractStatus.EXTRACTED_OLD) {
    return <Link fontSize={10} onClick={rename}>
      rename frames to new format
    </Link>
  }
  if(status == ExtractStatus.IN_PROGRESS) {
    return <ActivityIndicator />
  }

  return null
}
