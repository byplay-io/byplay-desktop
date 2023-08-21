import path from 'path';
import fs from 'fs';
import {app} from 'electron';
import streamDownload from './streamDownload';
import {getPlatform, Platform} from './platformHelpers';
import {
  sendMainToRenderer,
  subscribeMainToRenderer,
} from './ipcCommunicationMain';
import {IPCChannel} from '../../types/ipc';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const mv = require('mv');

function sendProgress(total: number, downloaded: number) {
  sendMainToRenderer('ffmpeg-download-progress', {
    total,
    downloaded,
  });
}

const FFMPEGDownloaderIPC = {
  isDownloaded() {
    return fs.existsSync(this.getTargetPath());
  },

  subscribe() {
    subscribeMainToRenderer<null, string>(
      IPCChannel.DOWNLOAD_FFMPEG,
      async () => {
        return this.download(sendProgress);
      },
    );
  },

  async download(
    onProgress: (total: number, downloaded: number) => void,
  ): Promise<string> {
    const newPath = this.getTargetPath();
    console.log('Downloading ffmpeg to', newPath);
    if (this.isDownloaded()) {
      console.log('already there', newPath);
      return newPath;
    }

    const tmpDownloadPath = path.join(
      app.getPath('temp'),
      `Byplay_ffmpeg_${Date.now()}`,
    );
    await streamDownload(this.getUrl(), tmpDownloadPath, onProgress);
    await new Promise((resolve) => {
      mv(tmpDownloadPath, newPath, resolve);
    });
    console.log('Moved ffmpeg', tmpDownloadPath, newPath);
    fs.chmodSync(newPath, 0o755);
    return newPath;
  },

  getTargetPath() {
    return path.join(app.getPath('userData'), this.getBinaryName());
  },

  getUrl() {
    switch (getPlatform()) {
      case Platform.LINUX:
        return 'https://storage.googleapis.com/byplay-website/standalone/ffmpeg/linux/ffmpeg';
      case Platform.MAC:
        return 'https://storage.googleapis.com/byplay-website/standalone/ffmpeg/mac/ffmpeg';
      case Platform.WINDOWS:
        return 'https://storage.googleapis.com/byplay-website/standalone/ffmpeg/win/ffmpeg.exe';
      default:
        throw new Error('Unknown platform');
    }
  },

  getBinaryName() {
    if (getPlatform() === Platform.WINDOWS) {
      return 'ffmpeg.exe';
    }
    return 'ffmpeg';
  },
};

export default FFMPEGDownloaderIPC;
