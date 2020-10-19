import {
  setRecordingStatusDownloaded,
  setRecordingStatusDownloading,
  setRecordingStatusExtracted,
  setRecordingStatusExtracting
} from '../features/recordingsList/recordingsListSlice';
import { Store } from '../store';
import ByplayAPIClient from './ByplayAPIClient';
import Downloader from './Downloader';
import { selectRecordingsDirPath } from '../features/recordingsDir/recordingsDirSlice';
import fs from 'fs';
import { formatBytesProgress } from '../utils/format';
import FFMPEGWrapper from '../utils/FFMPEGWrapper';
import { Analytics, AnalyticsUserEventType } from './Amplitude';

const {join, dirname} = require('path')


export default class RecordingLocalManager {
  recordingId: string
  path: string
  store: Store

  constructor(recordingId: string, store: Store) {
    this.recordingId = recordingId
    this.store = store
    this.path = join(selectRecordingsDirPath(store.getState()), this.recordingId)
  }

  async start() {
    await this.mkdirLocal("")
    await this.download()
    Analytics.registerUserEvent(AnalyticsUserEventType.RECORDING_DOWNLOADED, {
      recordingId: this.recordingId
    })
    await this.extract()
    Analytics.registerUserEvent(AnalyticsUserEventType.RECORDING_EXTRACTED, {
      recordingId: this.recordingId
    })
  }

  async openDir() {
    this.openItem(this.path)
  }

  async openInBlender() {
    for(let f of await fs.promises.readdir(this.path)) {
      if(f.endsWith(".blend")) {
        this.openItem(join(this.path, f))
        return
      }
    }
  }

  async openVideo() {
    this.openItem(join(this.path, "src_video.mp4"))
  }

  private async extract() {
    this.store.dispatch(setRecordingStatusExtracting(this.recordingId))

    await this.mkdirLocal("frames")
    let videoPath = join(this.path, "src_video.mp4")
    let framesPath = join(this.path, "frames", "%05d.png")
    let ffmpegPath = this.store.getState().ffmpeg.path!
    let totalFrames = this.getFramesNumber()
    await new FFMPEGWrapper(ffmpegPath).extract(
      videoPath,
      framesPath,
      processedFrames => {
        let percent = Math.round(100.0 * processedFrames / totalFrames)
        this.store.dispatch(
          setRecordingStatusExtracting(this.recordingId, `${percent}%`)
        )
      }
    )

    await fs.promises.writeFile(this.extractedFlagPath(), "-")

    this.store.dispatch(setRecordingStatusExtracted(this.recordingId))

  }

  isExtracted(): boolean {
    return fs.existsSync(this.path)
  }

  private extractedFlagPath() {
    return join(this.path, ".extracted")
  }

  private getFramesNumber() {
    return this.store.getState().recordingsList!.recordings!.find(
      rec => rec.id == this.recordingId
    )!.recordingManifest!.framesCount
  }

  private async download() {
    this.store.dispatch(setRecordingStatusDownloading(this.recordingId))
    // total size??
    let linksResponse = await ByplayAPIClient.instance.recordingLinks(this.recordingId)
    let totalSize = 0
    for(let {path, size} of linksResponse.response?.files!) {
      totalSize += size
      await this.mkdirLocal(dirname(path))
    }

    let totalDownloaded = 0
    for(let {link, path, size} of linksResponse.response?.files!) {
      let fullPath = join(this.path, path)
      await Downloader.download(link, fullPath, (_fileSize, currDownloaded) => {
        let currentlyDownloaded = totalDownloaded + currDownloaded
        this.store.dispatch(
          setRecordingStatusDownloading(
            this.recordingId,
            formatBytesProgress(totalSize, currentlyDownloaded)
          )
        )
      })
      totalDownloaded += size
      this.store.dispatch(
        setRecordingStatusDownloading(
          this.recordingId,
          formatBytesProgress(totalSize, totalDownloaded)
        )
      )
    }

    this.store.dispatch(setRecordingStatusDownloaded(this.recordingId))
  }

  private async mkdirLocal(dir: string) {
    let parts = dir.split("/")
    let currentPath = this.path
    for(let p of parts) {
      currentPath = join(currentPath, p)
      if(!fs.existsSync(currentPath)) {
        await fs.promises.mkdir(currentPath)
      }
    }
  }

  private openItem(path: string) {
    const {shell} = require('electron')
    shell.openItem(path)
  }
}
