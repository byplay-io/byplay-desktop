import React, { useEffect, useState } from 'react';
import { PageContent } from './PageContent';
import { Text } from 'rebass';
const { app } = require('electron').remote

export default function SupportPage() {
  return <PageContent title={"Help & Support"}>
    <Text>
      If you have any questions or are facing difficulties,<br />
      email us at <a href={"mailto:hello@byplay.io"}>hello@byplay.io</a>
    </Text>

    <Text color={"muted"} style={{position: "absolute", bottom: 10}}>
      App version: {app.getVersion()}
    </Text>
  </PageContent>
}
