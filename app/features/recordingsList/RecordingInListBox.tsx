import React from 'react';
import { IRecording, IRecordingStatus, ProcessState, RecordingState } from './recordingsListSlice';
import { Box, Button, Flex, Text } from 'rebass';
import { colors } from '../../theme';
import ActivityIndicator from '../../utils/ActivityIndicator';

const RecordingNotStartedActions = (props: {
  recording: IRecording,
  setDownloading: RecordingCallback,
  status: IRecordingStatus
}) => {
  let { status, setDownloading, recording } = props
  if(status.state != RecordingState.NOT_STARTED) {
    return null
  }
  return <Box>
    <Button variant={"outline"} onClick={() => setDownloading(recording.id)}>Download</Button>
  </Box>
}

const RecordingInProgressActions = (props: {recording: IRecording, status: IRecordingStatus}) => {
  let { status } = props
  if(status.state != RecordingState.IN_PROGRESS) {
    return null
  }
  let action = status.downloadState != ProcessState.DONE ? "Downloading" : "Extracting"
  let progress = status.downloadState != ProcessState.DONE ? status.downloadProgress : status.extractProgress
  if(!progress || progress.length == 0) {
    progress = "Starting"
  }
  return <Flex flexDirection={"row"}>
    <ActivityIndicator />
    <Flex flexDirection={"row"} m={1}>
      <Text color={"muted"} mr={1}>{action}: </Text>
      <Text>{progress}</Text>
    </Flex>
  </Flex>
}

const RecordingExtractedActions = (
  props: {
    recording: IRecording,
    openDir: RecordingCallback,
    openInBlender: RecordingCallback,
    openVideo: RecordingCallback,
    status: IRecordingStatus
  }) => {
  let { recording, status } = props

  if(status.state != RecordingState.EXTRACTED) {
    return null
  }

  return <Box>
    <Button variant={"outline"} mr={2} onClick={() => props.openDir(recording.id)}>Open dir</Button>
    <Button variant={"outline"} mr={2} onClick={() => props.openVideo(recording.id)}>Open video</Button>
    <Button variant={"outline"} mr={2} onClick={() => props.openInBlender(recording.id)}>
      Open in blender <img src={"https://storage.googleapis.com/byplay-website/standalone/blender-logo-small.png"} alt={"blender"} height={15} />
    </Button>
  </Box>
}


const RecordingInfoBox = (props: {recording: IRecording}) => {
  let { recording } = props
  let { framesCount, fps }  = recording.recordingManifest
  let duration = Math.round(framesCount / fps)
  let sec = (duration % 60).toString().padStart(2, "0")
  let min = Math.floor(duration / 60).toString().padStart(2, "0")
  return <Flex flexWrap={"wrap"}>
    <Box width={100} height={100} >
      <img
        src={recording.thumbnailUrl}
        style={{maxWidth: 100, maxHeight: 100}}
      />
    </Box>
    <Box pl={2} fontSize={3}>
      <Flex flexDirection={"row"}>
        <Text color={"muted"}>id:</Text>
        <Text ml={1}>{recording.id}</Text>
      </Flex>
      <Flex flexDirection={"row"}>
        <Text color={"muted"}>date:</Text>
        <Text ml={1}>{new Date(recording.recordingManifest.createdAtTimestamp).toLocaleString()}</Text>
      </Flex>
      <Flex flexDirection={"row"}>
        <Text color={"muted"}>duration:</Text>
        <Text ml={1}>{min}:{sec}</Text>
      </Flex>
      <Flex flexDirection={"row"}>
        <Text color={"muted"}>frames:</Text>
        <Text ml={1}>{recording.recordingManifest.framesCount} at {recording.recordingManifest.fps} fps</Text>
      </Flex>
    </Box>
  </Flex>
}

type RecordingCallback = (recording: string) => void

const RecordingInListBox = (
  props: {
    recording: IRecording,
    setDownloading: RecordingCallback,
    openDir: RecordingCallback,
    openInBlender: RecordingCallback,
    openVideo: RecordingCallback,
    status: IRecordingStatus
  }) => {
  let { recording } = props

  return <Flex flexDirection={"column"} p={2} mb={2} mr={2} width={500} bg={colors.secondaryBg}>
    <RecordingInfoBox recording={recording} />
    <Box pt={3}>
      <RecordingInProgressActions {...props} />
      <RecordingNotStartedActions {...props} />
      <RecordingExtractedActions {...props} />
    </Box>
  </Flex>
}

export default RecordingInListBox
