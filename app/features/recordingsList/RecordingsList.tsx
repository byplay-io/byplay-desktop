import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector, useStore } from 'react-redux';
import {
  selectProcessingCount,
  selectRecordingsList,
  setRecordingsListFromServer,
  selectRecordingStatuses,
  RecordingNotStartedStatus, setRecordingStatusExtracted, setRecordingStatusAtLeastNotStarted
} from './recordingsListSlice';
import RecordingLocalManager from '../../backend/RecordingLocalManager';
import ByplayAPIClient from '../../backend/ByplayAPIClient';
import RecordingInListBox from './RecordingInListBox';
import { Box, Button, Flex } from 'rebass';
import { PageContent } from '../../containers/PageContent';
import ActivityIndicator from '../../utils/ActivityIndicator';

export default function RecordingsList() {
  const processingCount = useSelector(selectProcessingCount)
  const recordings = useSelector(selectRecordingsList)
  const statuses = useSelector(selectRecordingStatuses)
  const [isLoading, setLoading] = useState(false)

  const dispatch = useDispatch()
  const store = useStore()

  const setDownloading = (recId: string) => {
    new RecordingLocalManager(recId, store).start()
  }

  const openDir = (recId: string) => {
    new RecordingLocalManager(recId, store).openDir()
  }

  const openInBlender = (recId: string) => {
    new RecordingLocalManager(recId, store).openInBlender()
  }

  const openVideo = (recId: string) => {
    new RecordingLocalManager(recId, store).openVideo()
  }

  const checkStatus = (recId: string) => {
    if(!statuses[recId]) {
      console.log("checking", recId)
      if (new RecordingLocalManager(recId, store).isExtracted()) {
        dispatch(setRecordingStatusExtracted(recId))
      } else {
        dispatch(setRecordingStatusAtLeastNotStarted(recId))
      }
    }
  }

  const reloadList = () => {
    setLoading(true)

    ByplayAPIClient.instance.recordingsList().then(
      rl => {
        let recordings = rl.response!
        dispatch(setRecordingsListFromServer(recordings))
        for(let {id} of recordings.recordings) {
          checkStatus(id)
        }
        setLoading(false)
      }
    ).catch(e => {
      setLoading(false)
      throw e
    })
  }

  useEffect(reloadList, [])

  return <PageContent title={"Your videos"}>
    {isLoading ? <ActivityIndicator /> : null}
    {processingCount ? <Box sx={{fontFamily: "monospace"}}>
      <h3>Processing: {processingCount}</h3>
    </Box> : null}
    <Box my={3}>
      <Button variant={"outline"} onClick={reloadList} disabled={isLoading}>
        Refresh
      </Button>
    </Box>
    <Flex flexDirection={"row"} flexWrap={"wrap"}>
    {
      (recordings || []).map(recording =>
        <RecordingInListBox
          key={recording.id}
          recording={recording}
          setDownloading={setDownloading}
          openDir={openDir}
          openInBlender={openInBlender}
          openVideo={openVideo}
          status={statuses[recording.id] || RecordingNotStartedStatus}
        />
      )
    }
    </Flex>
  </PageContent>
}
