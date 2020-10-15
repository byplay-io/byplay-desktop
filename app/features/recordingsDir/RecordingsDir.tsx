import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectRecordingsDirPath,
  setRecordingsDirPath
} from './recordingsDirSlice';
import { Text, Box, Button, Flex, Heading, LinkProps } from 'rebass';
import FFMPEGWrapper from '../../utils/FFMPEGWrapper';
import { PageContent } from '../../containers/PageContent';
import { colors } from '../../theme';
import { Link } from 'react-router-dom';
import routes from '../../constants/routes.json';
import { Link as RouterLink } from 'react-router-dom'
import { Link as RebassLink } from 'rebass'
import { RootState } from '../../store';

const NavLink = (props: {title: string, to: string, disabled?: boolean}) => {
  // @ts-ignore
  let prop: LinkProps = {to: props.to}
  let currentLocation = useSelector((state: RootState) => state.router.location)

  let isActive = currentLocation.pathname == props.to

  return <RebassLink
    sx={{
      display: 'inline-block',
      fontWeight: 'bold',
      py: 1,
      color: isActive ? 'highlight' : 'secondary',
      fontFamily: "monospace"
    }}
    as={RouterLink}
    disabled={props.disabled || isActive}
    {...prop}
  >
    {props.title}
  </RebassLink>
}

export default function RecordingsDir() {
  const recordingsDirPath = useSelector(selectRecordingsDirPath)

  const dispatch = useDispatch()

  const handleButtonClick = async () => {
    const { dialog } = require('electron').remote

    let value = await dialog.showOpenDialog({ properties: ['openDirectory'] })
    if(value && value.filePaths.length == 1) {
      dispatch(setRecordingsDirPath(value.filePaths[0]))
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
