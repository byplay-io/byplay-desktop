import { ipcMain, ipcRenderer, WebContents } from 'electron';
import fs from "fs";
import { default as axios } from 'axios';

type ProgressListener = (total: number, downloaded: number) => void
export default class Downloader {
  static progressListeners: {[k: string]: ProgressListener} = {}
  // downloadId: [resolve, reject]
  static returnPromises: {[k: string]: [() => void, (error: any) => void]} = {}

  static channelDownloadFileCommand = "downloadFile"
  static channelDownloadFileProgress = "downloadFileProgress"
  static channelDownloadFileDone = "downloadFileDone"

  static download(
    url: string,
    targetPath: string,
    onProgress: ProgressListener
  ): Promise<void> {
    console.log("Downloading with stream", url, targetPath)
    let downloadId = `${Date.now()}_${Math.random()}`

    this.progressListeners[downloadId] = onProgress
    ipcRenderer.send(this.channelDownloadFileCommand, downloadId, url, targetPath)

    return new Promise((resolve, reject) => {
      this.returnPromises[downloadId] = [resolve, reject]
    })
  }

  static subscribeRenderer() {
    ipcRenderer.on(this.channelDownloadFileProgress, (_event, downloadId, total, progress) => {
      let progressListener = this.progressListeners[downloadId]
      if(!progressListener) {
        console.warn("received downloadFileProgress but didn't find the listener", downloadId)
        return
      }

      console.log("Invoking", downloadId, total, progress)

      progressListener(total, progress)
    })

    ipcRenderer.on(this.channelDownloadFileDone, (_event, downloadId, error) => {
      let promise = this.returnPromises[downloadId]
      if(!promise) {
        console.warn("received downloadFileDone but didn't find the listener", downloadId)
        return
      }

      console.log("Invoking DONE", downloadId, error)
      let [resolve, reject] = promise

      if(error) {
        reject(error)
      } else {
        resolve()
      }

      delete this.returnPromises[downloadId]
      delete this.progressListeners[downloadId]
    })
  }

  static subscribeMain(webContents: WebContents) {
    ipcMain.on(this.channelDownloadFileCommand, (_event, downloadId, url, targetPath) => {
      console.log("received channelDownloadFileCommand", downloadId, url, targetPath)

      const writer = fs.createWriteStream(targetPath)
      let notifyProgressEveryMs = 1000

      return axios({
        method: 'get',
        url: url,
        responseType: 'stream',
      }).then(response => {
        const totalLength = parseInt(response.headers['content-length'])
        console.log("TOTAL LEN", totalLength)
        let currentDownloaded = 0
        let lastNotificationAt = Date.now()

        response.data.on('data', (chunk: {length: number}) => {
          currentDownloaded += chunk.length
          if(Date.now() - lastNotificationAt > notifyProgressEveryMs) {
            lastNotificationAt = Date.now()
            webContents.send(this.channelDownloadFileProgress, downloadId, totalLength, currentDownloaded)
          }
        })

        response.data.pipe(writer);

        let error: any = null;
        writer.on('error', err => {
          error = err;
          writer.close();
          webContents.send(this.channelDownloadFileDone, downloadId, err);
        });
        writer.on('close', () => {
          if (!error) {
            webContents.send(this.channelDownloadFileDone, downloadId, null);
          }
        });
      });
    })
  }
}
