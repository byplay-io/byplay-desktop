import React, { useEffect } from 'react';
import { PageContent } from './PageContent';
import { Box, Button, Link, Text } from 'rebass';
import { Analytics, AnalyticsUserEventType } from '../backend/Amplitude';

const { app } = require('electron').remote
const log = require('electron-log');

export default function SupportPage() {
  const openItem = (item: string, eventType: AnalyticsUserEventType) => {
    Analytics.registerUserEvent(eventType)
    require('electron').shell.openItem(item)
  }
  const openUrl = (url: string, eventType: AnalyticsUserEventType) => {
    Analytics.registerUserEvent(eventType)
    require('electron').shell.openExternal(url)
  }

  useEffect(() => {
    Analytics.registerUserEvent(AnalyticsUserEventType.SUPPORT_PAGE_RENDERED)
  }, [])

  const openLogs = () => openItem(
    log.transports.file.getFile().path,
    AnalyticsUserEventType.SUPPORT_OPEN_LOGS_CLICKED
  )
  const openDocs = () => openUrl(
    "https://byplay.io/docs",
    AnalyticsUserEventType.SUPPORT_OPEN_DOCS_CLICKED
  )
  const writeMail = () => openUrl(
    "mailto:hello@byplay.io",
    AnalyticsUserEventType.SUPPORT_WRITE_EMAIL_CLICKED
  )

  return <PageContent title={"Help & Support"}>
    <Text>
      Check out the <Link onClick={openDocs}>docs section</Link> on the byplay.io website
    </Text>


    <Text my={3}>
      If you have any questions or are facing difficulties,<br />
      email us at <Link onClick={writeMail}>hello@byplay.io</Link>
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
