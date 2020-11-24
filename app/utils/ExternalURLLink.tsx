import React, { ReactNode } from 'react';
import { Link } from 'rebass';
import { Analytics, AnalyticsUserEventType } from '../backend/Amplitude';

export default function(props: {href: string, children: ReactNode}) {
  const onClick = () => {
    Analytics.registerUserEvent(AnalyticsUserEventType.EXTERNAL_URL_LINK_CLICKED, {
      href: props.href
    })
    require('electron').shell.openExternal(props.href)
  }
  return <Link onClick={onClick}>{props.children}</Link>
}
