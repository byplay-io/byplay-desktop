import React, { useEffect, useState } from 'react';
import { PageContent } from '../../containers/PageContent';
import { Flex, Text } from 'rebass';
import ActivityIndicator from '../../utils/ActivityIndicator';
import FfmpegDownloader from './FfmpegDownloader';
import { formatBytesProgress } from '../../utils/format';
import { useDispatch } from 'react-redux';
import { setFFMPEGPath } from './ffmpegSlice';
import FFMPEGWrapper from '../../utils/FFMPEGWrapper';
import Preferences from '../../Preferences';
import { Analytics, AnalyticsUserEventType } from '../../backend/Amplitude';

export default function FfmpegDownloadPage(props: {asMain: boolean}) {
  let [progress, setProgress] = useState("")
  let [error, setError] = useState<string | null>(null)

  const dispatch = useDispatch()

  const checkAndSetPath = async (path: string) => {
    try {
      if (await (new FFMPEGWrapper(path).isWorking())) {
        dispatch(setFFMPEGPath(path))
        Analytics.registerUserEvent(AnalyticsUserEventType.FFMPEG_FINISHED_DOWNLOADING)
        await new Preferences().set("ffmpegPath", path)
      }
    } catch (e) {
      Analytics.registerUserEvent(AnalyticsUserEventType.FFMPEG_FAILED_DOWNLOADING, {error: e.message})
      setError(e.message)
    }
  }

  useEffect(() => {
    const onProgress = (total: number, downloaded: number) =>
      setProgress(formatBytesProgress(total, downloaded));

    Analytics.registerUserEvent(AnalyticsUserEventType.FFMPEG_STARTED_DOWNLOADING)
    new FfmpegDownloader().download(onProgress).then(checkAndSetPath)
  }, []);

  if(!props.asMain) {
    return <Flex>
      <Text>Downloading ffmpeg... {progress}</Text>
    </Flex>
  } else {
    return <PageContent title={"Downloading ffmpeg"}>
      <ActivityIndicator />
      <br />
      <Text>{progress}</Text>
      <Text>
        Please wait while we are downloading the ffmpeg binary.<br />
        We prefer to use our own to make sure it has all needed modules
      </Text>
      {error ? <Text my={3} color={"red"}>Error: {error}</Text> : null}
    </PageContent>
  }
}
