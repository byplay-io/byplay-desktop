import {ipcMain, ipcRenderer, type WebContents} from 'electron';
import fs from 'fs';
import {default as axios} from 'axios';
// import { info, silly, warn } from 'electron-log';

type ProgressListener = (total: number, downloaded: number) => void;
export default class Downloader {
  static progressListeners: Record<string, ProgressListener> = {};
  // downloadId: [resolve, reject]
  static returnPromises: Record<string, [() => void, (error: any) => void]> =
    {};

  static channelDownloadFileCommand = 'downloadFile';
  static channelDownloadFileProgress = 'downloadFileProgress';
  static channelDownloadFileDone = 'downloadFileDone';

  static async download(
    url: string,
    targetPath: string,
    onProgress: ProgressListener,
  ): Promise<void> {
    console.log('Downloading with stream', url, targetPath);
    const downloadId = `${Date.now()}_${Math.random()}`;

    this.progressListeners[downloadId] = onProgress;
    ipcRenderer.send(
      this.channelDownloadFileCommand,
      downloadId,
      url,
      targetPath,
    );

    await new Promise((resolve, reject) => {
      this.returnPromises[downloadId] = [resolve, reject];
    });
  }

  static subscribeRenderer() {
    ipcRenderer.on(
      this.channelDownloadFileProgress,
      (_event, downloadId, total, progress) => {
        const progressListener = this.progressListeners[downloadId];
        if (!progressListener) {
          warn(
            "received downloadFileProgress but didn't find the listener",
            downloadId,
          );
          return;
        }

        silly('Invoking', downloadId, total, progress);

        progressListener(total, progress);
      },
    );

    ipcRenderer.on(
      this.channelDownloadFileDone,
      (_event, downloadId, error) => {
        const promise = this.returnPromises[downloadId];
        if (!promise) {
          warn(
            "received downloadFileDone but didn't find the listener",
            downloadId,
          );
          return;
        }

        info('Invoking DONE', downloadId, error);
        const [resolve, reject] = promise;

        if (error) {
          reject(error);
        } else {
          resolve();
        }

        delete this.returnPromises[downloadId];
        delete this.progressListeners[downloadId];
      },
    );
  }

  static subscribeMain(webContents: WebContents) {
    ipcMain.on(
      this.channelDownloadFileCommand,
      async (_event, downloadId, url, targetPath) => {
        info(
          'received channelDownloadFileCommand',
          downloadId,
          url,
          targetPath,
        );

        const writer = fs.createWriteStream(targetPath);
        const notifyProgressEveryMs = 1000;

        await axios({
          method: 'get',
          url,
          responseType: 'stream',
        }).then((response) => {
          const totalLength = parseInt(response.headers['content-length']);
          info('TOTAL LEN', totalLength);
          let currentDownloaded = 0;
          let lastNotificationAt = Date.now();

          response.data.on('data', (chunk: {length: number}) => {
            currentDownloaded += chunk.length;
            if (Date.now() - lastNotificationAt > notifyProgressEveryMs) {
              lastNotificationAt = Date.now();
              webContents.send(
                this.channelDownloadFileProgress,
                downloadId,
                totalLength,
                currentDownloaded,
              );
            }
          });

          response.data.pipe(writer);

          let error: any = null;
          writer.on('error', (err) => {
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
      },
    );
  }
}
