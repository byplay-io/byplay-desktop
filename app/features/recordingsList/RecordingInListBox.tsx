import React from 'react';
import { IRecording, IRecordingStatus, ProcessState, RecordingState } from './recordingsListSlice';
import { Box, Button, Flex, Link, Text } from 'rebass';
import { colors } from '../../theme';
import ActivityIndicator from '../../utils/ActivityIndicator';
import StarRating from '../feedback/StarRating';
import { IoTrash } from 'react-icons/io5';
import { Analytics, AnalyticsUserEventType } from '../../backend/Amplitude';
import RenameOldFrameFormatLink from './RenameOldFrameFormatLink';

const showJumpyTrackingAlert = () => {
  Analytics.registerUserEvent(AnalyticsUserEventType.HELP_JUMPY_TRACKING_CLICKED)
  alert(
    "AR tracking isn't always perfect.\n" +
    "If you see that camera is jittering or jumpy, send feedback for that video by clicking stars and mentioning the problem\n" +
    "and I'll run refinement for it manually, emailing you the result\n" +
    "This is a temporary workflow until I make sure that refinement works in most cases"
  )
}

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
    <Button onClick={() => setDownloading(recording.id)}>Download</Button>
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
    redownload: RecordingCallback,
    openDir: RecordingCallback,
    openInBlender: RecordingCallback,
    openVideo: RecordingCallback,
    rateVideo: (recordingId: string, rating: number) => void,
    status: IRecordingStatus
  }) => {
  let { recording, status } = props

  if(status.state != RecordingState.EXTRACTED) {
    return null
  }

  return <Flex flexDirection={"row"}>
    <Button variant={"outline"} mr={2} onClick={() => props.openDir(recording.id)}>Open folder</Button>
    <Button variant={"outline"} mr={2} onClick={() => props.openVideo(recording.id)}>Video</Button>
    <Button variant={"outline"} mr={2} onClick={() => props.openInBlender(recording.id)}>
      <img src={"https://storage.googleapis.com/byplay-website/standalone/blender-logo-small.png"} alt={"blender"} height={17} />
    </Button>
    <Box flex={"auto"} />
    <Box style={{position: 'relative'}}>
      <Box style={{position: 'absolute', top: -80, right: 0, textAlign: 'right'}}>
        <RenameOldFrameFormatLink recordingId={recording.id} />
      </Box>
      <Box style={{position: 'absolute', top: -40, right: 0}}>
        <Link fontSize={10} onClick={() => props.redownload(recording.id)}>re-download files</Link>
      </Box>
      <Box style={{position: 'absolute', top: -20, right: 0}}>
        <Link fontSize={10} onClick={showJumpyTrackingAlert}>bad tracking?</Link>
      </Box>
      <StarRating onClick={(rating: number) => props.rateVideo(recording.id, rating)} />
    </Box>
    {/*<Button variant={"outline"} mr={2} onClick={() => props.rateVideo(recording.id)}>Rate</Button>*/}
  </Flex>
}

const RecordingDeleteBox = (props: {recording: IRecording, onDelete: (recordingId: string) => void}) => {
  const handleClick = () => {
    const res = confirm("This will delete the video from the cloud, but not from the disk. Proceed?")
    if(res) {
      props.onDelete(props.recording.id)
    }
  }

  return <Box ml={'auto'}>
    <Button variant={"outlineDanger"} onClick={handleClick}>
      <IoTrash />
    </Button>
  </Box>
}


const RecordingInfoBox = (props: {
  recording: IRecording,
  onDeleteRecording: RecordingCallback,
  status: IRecordingStatus
}) => {
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
    {props.status.state == RecordingState.IN_PROGRESS ?
      null :
      <RecordingDeleteBox recording={props.recording} onDelete={props.onDeleteRecording} /> }
  </Flex>
}

type RecordingCallback = (recording: string) => void

const RecordingInListBox = (
  props: {
    recording: IRecording,
    setDownloading: RecordingCallback,
    redownload: RecordingCallback,
    openDir: RecordingCallback,
    openInBlender: RecordingCallback,
    openVideo: RecordingCallback,
    rateVideo: (recordingId: string, rating: number) => void,
    deleteRecording: RecordingCallback,
    status: IRecordingStatus
  }) => {
  let { recording } = props

  let borderColor = colors.secondaryBg
  if(props.status.state == RecordingState.NOT_STARTED) {
    borderColor = colors.notDownloadedBorder
  }
  if(props.status.state == RecordingState.IN_PROGRESS) {
    borderColor = colors.downloadingBorder
  }
  return <Flex flexDirection={"column"}
               p={2} mb={2} mr={2} width={500}
               bg={colors.secondaryBg}
               style={{borderLeft: `5px solid ${borderColor}`}}
  >
    <RecordingInfoBox
      recording={recording}
      onDeleteRecording={props.deleteRecording}
      status={props.status}
    />
    <Box pt={3}>
      <RecordingInProgressActions {...props} />
      <RecordingNotStartedActions {...props} />
      <RecordingExtractedActions {...props} />
    </Box>
  </Flex>
}

export default RecordingInListBox
