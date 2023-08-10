import fs from 'fs';
import axios from 'axios';
import {info} from 'electron-log';

type ProgressListener = (total: number, downloaded: number) => void;

export default async function streamDownload(
  url: string,
  targetPath: string,
  onProgress: ProgressListener,
): Promise<void> {
  return new Promise((resolve, reject) => {
    console.log('Downloading with stream', url, targetPath);
    const writer = fs.createWriteStream(targetPath);
    const notifyProgressEveryMs = 1000;

    axios({
      method: 'get',
      url,
      responseType: 'stream',
    })
      .then((response) => {
        const totalLength = parseInt(response.headers['content-length'], 10);
        info('TOTAL LEN', totalLength);
        let currentDownloaded = 0;
        let lastNotificationAt = Date.now();

        response.data.on('data', (chunk: {length: number}) => {
          currentDownloaded += chunk.length;
          if (Date.now() - lastNotificationAt > notifyProgressEveryMs) {
            lastNotificationAt = Date.now();
            onProgress(totalLength, currentDownloaded);
          }
        });

        response.data.pipe(writer);

        let error = false;
        writer.on('error', (err) => {
          writer.close();
          error = true;
          reject(err);
        });
        writer.on('close', () => {
          if (!error) {
            resolve();
          }
        });

        return null;
      })
      .catch(reject);
  });
}
