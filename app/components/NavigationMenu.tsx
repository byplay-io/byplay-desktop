import React from 'react';
import routes from '../constants/routes.json';
import { Box, Flex, LinkProps, Text } from 'rebass';
import { Link as RouterLink } from 'react-router-dom'
import { Link as RebassLink } from 'rebass'
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { selectIsSetUp } from '../features/setup';
import { colors } from '../theme';
import { selectIsAuthorized } from '../features/auth/authSlice';
import { selectRecordingsDirPath } from '../features/recordingsDir/recordingsDirSlice';
import { selectFfmpegPath } from '../features/ffmpeg/ffmpegSlice';

const SetupCheckbox = (props: {title: string, active: boolean}) => {
  let isSetUp = useSelector(selectIsSetUp)
  if(isSetUp) {
    return null
  }
  return <Text
    sx={{
      display: 'inline-block',
      fontWeight: 'bold',
      px: 2,
      py: 1,
      color: props.active ? 'successMuted' : 'muted',
      fontFamily: "monospace"
    }}
  >
    {props.title}
  </Text>
}

const NavLink = (props: {title: string, to: string, whenNotSetUp?: boolean, disabled?: boolean}) => {
  // @ts-ignore
  let prop: LinkProps = {to: props.to}
  let currentLocation = useSelector((state: RootState) => state.router.location)

  let isActive = currentLocation.pathname == props.to
  let isSetUp = useSelector(selectIsSetUp)
  if(!isSetUp && !props.whenNotSetUp) {
    return null
  }

  return <RebassLink
    sx={{
      display: 'inline-block',
      fontWeight: 'bold',
      px: 2,
      py: 1,
      color: isActive ? 'highlight' : 'primary',
      fontFamily: "monospace"
    }}
    as={RouterLink}
    disabled={props.disabled || isActive}
    {...prop}
  >
    {props.title}
  </RebassLink>
}

const NavigationMenu = () => {
  let isSetUp = useSelector(selectIsSetUp)
  let isAuthorized = useSelector(selectIsAuthorized)
  let hasRecordingsDir = !!useSelector(selectRecordingsDirPath)
  let downloadedFfmpeg = !!useSelector(selectFfmpegPath)

  return <Flex height={50} style={{borderBottom: `1px dashed ${colors.brightMuted}`}} bg={colors.secondaryBg} py={2}>
    <SetupCheckbox title={"Auth"} active={isAuthorized} />
    <SetupCheckbox title={"Select dir"} active={hasRecordingsDir} />
    <SetupCheckbox title={"Dependencies"} active={downloadedFfmpeg} />
    { !isSetUp ? <Box mx='auto' /> : null }
    <NavLink title={isSetUp ? "Settings" : "Set up"} to={routes.SETUP} whenNotSetUp />
    <NavLink title={"Plugins"} to={routes.PLUGINS} />
    <NavLink title={"Videos"} to={routes.RECORDINGS_LIST} />
    <NavLink title={"Help & Support"} to={routes.SUPPORT} whenNotSetUp />
    { isSetUp ? <Box mx='auto' /> : null }
    <NavLink title={"Sign out"} to={routes.SIGN_OUT} />
  </Flex>
}

export default NavigationMenu
