import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectRecordingsDirPath,
  setRecordingsDirPath
} from './recordingsDirSlice';
import { Text, Button, Flex } from 'rebass';
import { PageContent } from '../../containers/PageContent';
import { colors } from '../../theme';
import routes from '../../constants/routes.json';
import Preferences from '../../Preferences';
import { Analytics, AnalyticsUserEventType } from '../../backend/Amplitude';
import NavLink from '../../utils/NavLink';

export default function RecordingsDir() {
  const recordingsDirPath = useSelector(selectRecordingsDirPath)

  const dispatch = useDispatch()

  const rememberRecordingsDir = (dir: string) => {
    dispatch(setRecordingsDirPath(dir))
    new Preferences().set("recordingsDir", dir)
  }

  const handleButtonClick = async () => {
    const { dialog } = require('electron').remote

    let value = await dialog.showOpenDialog({ properties: ['openDirectory'] })
    if(value && value.filePaths.length == 1) {
      rememberRecordingsDir(value.filePaths[0])
      Analytics.registerUserEvent(AnalyticsUserEventType.RECORDINGS_DIR_SELECTED)
    }
  }

  return <PageContent title={"Choose where to store videos"}>
    <Text py={1}>
      Select a directory where Byplay can put downloaded videos and FBX files
    </Text>
    <Text py={1}>
      Keep in mind that extracted video frames require a lot of space, several MBs per image in PNG format
      <br />
      Make sure that the directory is on a drive that has at least several GBs
    </Text>
    <Button mt={3} onClick={handleButtonClick} variant={"outline"}>
      Select directory
    </Button>
    { recordingsDirPath ?
      <Text
        fontFamily={"monospace"}
        mt={2}
        fontSize={1}
        p={1}
        style={{borderColor: colors.bright, borderWidth: 1, borderStyle: "solid", borderRadius: 3}}
        bg={"highlightMuted"}
      >
        {recordingsDirPath}
      </Text> : null
    }

    { recordingsDirPath ?
      <Flex mt={4} flexDirection={"column"}>
        <Text>Great! You're all set up</Text>
        <NavLink title={"Continue ->"} to={routes.PLUGINS} />
      </Flex> : null }
  </PageContent>
}
