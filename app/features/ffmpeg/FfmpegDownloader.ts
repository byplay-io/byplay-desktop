import { getPlatform } from '../../binaries';
import path from "path";
import fs from "fs";
import Downloader from '../../backend/Downloader';
const { app } = require('electron').remote

export default class FfmpegDownloader {
  constructor() {
  }

  isDownloaded() {
    return fs.existsSync(this.getTargetPath())
  }

  async download(onProgress: (total: number, downloaded: number) => void): Promise<string> {
    let newPath = this.getTargetPath()
    if(this.isDownloaded()) {
      return newPath
    }

    let tmpDownloadPath = path.join(app.getPath('temp'), `Byplay_ffmpeg_${Date.now()}`)
    await Downloader.download(this.getUrl(), tmpDownloadPath, onProgress)
    await fs.promises.rename(tmpDownloadPath, newPath)
    await fs.chmodSync(newPath, 0o755);
    return newPath
  }

  getTargetPath() {
    return path.join(
      app.getPath('userData'), this.getBinaryName()
    )
  }

  getUrl() {
    switch (getPlatform()) {
      case 'linux':
        return "https://storage.googleapis.com/byplay-website/standalone/ffmpeg/linux/ffmpeg"
      case 'mac':
        return "https://storage.googleapis.com/byplay-website/standalone/ffmpeg/mac/ffmpeg"
      case 'win':
        return "https://storage.googleapis.com/byplay-website/standalone/ffmpeg/win/ffmpeg.exe"
      default:
        throw "Unknown platform"
    }
  }

  getBinaryName() {
    if(getPlatform() == "win") {
      return "ffmpeg.exe"
    }
    return "ffmpeg"
  }
}
