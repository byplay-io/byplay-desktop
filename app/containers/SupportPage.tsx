import React, { useEffect, useState } from 'react';
import { PageContent } from './PageContent';
import { Box, Button, Flex, Text } from 'rebass';
import { Analytics, AnalyticsUserEventType } from '../backend/Amplitude';
import { dirname } from 'path';
const { app } = require('electron').remote
const log = require('electron-log');

export default function SupportPage() {
  useEffect(() => {
    Analytics.registerUserEvent(AnalyticsUserEventType.SUPPORT_PAGE_RENDERED)
  }, [])

  const openLogs = () => {
    const {shell} = require('electron')
    shell.openItem(dirname(log.transports.file.getFile().path))
  }

  return <PageContent title={"Help & Support"}>
    <Text>
      If you have any questions or are facing difficulties,<br />
      email us at <a href={"mailto:hello@byplay.io"}>hello@byplay.io</a>
    </Text>

    <Text color={"muted"} style={{position: "absolute", bottom: 10}}>
      App version: {app.getVersion()}
    </Text>

    <Box my={5}>
      <h3>Logs</h3>
      <Text>
        If something isn't working in this app or in plugins, you might want to send logs to us so that we can investigate what happened.
      </Text>
      <Button my={1} variant={"outline"} onClick={openLogs}>
        Open logs dir
      </Button>

      <Text>
        And send all files you see there to <a href={"mailto:hello@byplay.io"}>hello@byplay.io</a>
      </Text>
    </Box>

  </PageContent>
}
