import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector, useStore } from 'react-redux';
import {
  RecordingNotStartedStatus,
  selectProcessingCount,
  selectRecordingsList,
  selectRecordingStatuses,
  setRecordingsListFromServer,
  setRecordingStatusAtLeastNotStarted,
  setRecordingStatusExtracted
} from './recordingsListSlice';
import RecordingLocalManager from '../../backend/RecordingLocalManager';
import ByplayAPIClient from '../../backend/ByplayAPIClient';
import RecordingInListBox from './RecordingInListBox';
import { Box, Button, Flex, Text } from 'rebass';
import { PageContent } from '../../containers/PageContent';
import ActivityIndicator from '../../utils/ActivityIndicator';
import { Analytics, AnalyticsUserEventType } from '../../backend/Amplitude';
import NavLink from '../../utils/NavLink';
import routes from '../../constants/routes.json';

export default function RecordingsList() {
  const processingCount = useSelector(selectProcessingCount)
  const recordings = useSelector(selectRecordingsList)
  const statuses = useSelector(selectRecordingStatuses)
  const [isLoading, setLoading] = useState(false)

  const dispatch = useDispatch()
  const store = useStore()

  const setDownloading = (recordingId: string) => {
    Analytics.registerUserEvent(AnalyticsUserEventType.RECORDING_DOWNLOAD_CLICKED, { recordingId })
    new RecordingLocalManager(recordingId, store).start()
  }

  const openDir = (recordingId: string) => {
    Analytics.registerUserEvent(AnalyticsUserEventType.RECORDING_OPEN_DIR_CLICKED, { recordingId })
    new RecordingLocalManager(recordingId, store).openDir()
  }

  const openInBlender = (recordingId: string) => {
    Analytics.registerUserEvent(AnalyticsUserEventType.RECORDING_OPEN_BLENDER_CLICKED, { recordingId })
    new RecordingLocalManager(recordingId, store).openInBlender()
  }

  const openVideo = (recordingId: string) => {
    Analytics.registerUserEvent(AnalyticsUserEventType.RECORDING_OPEN_VIDEO_CLICKED, { recordingId })
    new RecordingLocalManager(recordingId, store).openVideo()
  }

  const checkStatus = (recordingId: string) => {
    if(!statuses[recordingId]) {
      if (new RecordingLocalManager(recordingId, store).isExtracted()) {
        dispatch(setRecordingStatusExtracted(recordingId))
      } else {
        dispatch(setRecordingStatusAtLeastNotStarted(recordingId))
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
  useEffect(() => {
    Analytics.registerUserEvent(AnalyticsUserEventType.RECORDINGS_PAGE_RENDERED)
  }, [])

  return <PageContent title={"Your videos"}>
    <Box>
      Curious how to get a video into C4D, Blender, Houdini or After Effects?
      <NavLink ml={2} title={"Go to Plugins"} to={routes.PLUGINS} />
    </Box>
    {isLoading ? <ActivityIndicator /> : null}
    {processingCount ? <Box sx={{fontFamily: "monospace"}}>
      <h3>Processing: {processingCount}</h3>
      <Text fontSize={1} color={"muted"}>
        Some of your videos are still processing in our cloud. Usually it takes less than 2 minutes, depending on duration
      </Text>
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
