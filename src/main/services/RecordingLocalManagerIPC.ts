import fs from 'fs';
import {dirname, join} from 'path';
import {shell} from 'electron';
import {info} from 'electron-log';
import streamDownload from './streamDownload';
import FFMPEGWrapper from './FFMPEGWrapper';
import {type IByplayAPIResponseRecordingLinks} from '../../types/byplayAPI';
import {
  sendMainToRenderer,
  subscribeMainToRenderer,
} from './ipcCommunicationMain';
import {
  IPCChannel,
  type IRecordingManager,
  type MessageM2RRecordingProcessProgress,
  type MessageM2RRecordingProcessStatus,
  type RecordingManagerSettings,
} from '../../types/ipc';

export default class RecordingLocalManagerIPC implements IRecordingManager {
  recordingId: string;
  path: string;
  motionOnly: boolean;
  ffmpegPath: string;

  constructor(
    recordingId: string,
    ffmpegPath: string,
    recordingsDirPath: string,
  ) {
    this.recordingId = recordingId;
    this.motionOnly = this.recordingId.endsWith('_MO');
    this.ffmpegPath = ffmpegPath;
    this.path = join(recordingsDirPath, this.recordingId);
  }

  async downloadAndExtract(links: IByplayAPIResponseRecordingLinks) {
    this.mkdirLocalSync('');
    await this.download(links);
    await this.extract();
  }

  openDir() {
    RecordingLocalManagerIPC.openItem(this.path);
  }

  async openInBlender() {
    for (const f of await fs.promises.readdir(this.path)) {
      if (f.endsWith('_ar_v1.blend')) {
        RecordingLocalManagerIPC.openItem(join(this.path, f));
        return;
      }
    }
    for (const f of await fs.promises.readdir(this.path)) {
      if (f.endsWith('.blend')) {
        RecordingLocalManagerIPC.openItem(join(this.path, f));
        return;
      }
    }
  }

  openVideo() {
    RecordingLocalManagerIPC.openItem(join(this.path, 'src_video.mp4'));
  }

  private async extract() {
    this.emitProcessStatus('extract', 'started');

    if (!this.motionOnly) {
      this.mkdirLocalSync('frames');
      const videoPath = join(this.path, 'src_video.mp4');
      const framesPath = join(this.path, 'frames', 'ar_%05d.png');
      await new FFMPEGWrapper(this.ffmpegPath).extract(
        videoPath,
        framesPath,
        (processedFrames) => {
          this.emitProcessProgress('extract', -1, processedFrames);
        },
      );
    }

    await fs.promises.writeFile(this.extractedFlagPath(), '-');

    this.emitProcessStatus('extract', 'done');
  }

  async isExtracted(): Promise<boolean> {
    return fs.existsSync(this.extractedFlagPath());
  }

  doesExist(filePath: string): boolean {
    return fs.existsSync(join(this.path, filePath));
  }

  private extractedFlagPath() {
    return join(this.path, '.extracted');
  }

  public async downloadFile(
    path: string,
    link: string,
    onProgress: (v: number) => void = (_) => null,
  ) {
    const fullPath = join(this.path, path);
    await streamDownload(link, fullPath, (_fileSize, currDownloaded) => {
      onProgress(currDownloaded);
    });
  }

  private async download(links: IByplayAPIResponseRecordingLinks) {
    this.emitProcessStatus('download', 'started');
    let totalSize = 0;
    links.files.forEach(({path, size}) => {
      totalSize += size;
      this.mkdirLocalSync(dirname(path));
    });

    let totalDownloaded = 0;

    const onProgress = (currDownloaded: number) => {
      const currentlyDownloaded = totalDownloaded + currDownloaded;
      this.emitProcessProgress('download', totalSize, currentlyDownloaded);
    };

    for (const {link, path, size} of links.files) {
      // eslint-disable-next-line no-await-in-loop
      await this.downloadFile(path, link, onProgress);
      totalDownloaded += size;
      this.emitProcessProgress('download', totalSize, totalDownloaded);
    }

    this.emitProcessStatus('download', 'done');
  }

  private mkdirLocalSync(dir: string) {
    const parts = dir.split('/');
    let currentPath = this.path;
    for (const p of parts) {
      currentPath = join(currentPath, p);
      if (!fs.existsSync(currentPath)) {
        fs.mkdirSync(currentPath);
      }
    }
  }

  private static openItem(path: string) {
    void shell.openExternal(path);
  }

  private emitProcessStatus(
    processType: MessageM2RRecordingProcessStatus['payload']['processType'],
    status: MessageM2RRecordingProcessStatus['payload']['status'],
  ) {
    sendMainToRenderer('recording-process-status', {
      recordingId: this.recordingId,
      processType,
      status,
    });
  }

  private emitProcessProgress(
    processType: MessageM2RRecordingProcessProgress['payload']['processType'],
    total: MessageM2RRecordingProcessProgress['payload']['total'],
    done: MessageM2RRecordingProcessProgress['payload']['done'],
  ) {
    sendMainToRenderer('recording-process-progress', {
      recordingId: this.recordingId,
      processType,
      total,
      done,
    });
  }

  public static subscribe() {
    function makeManager(settings: RecordingManagerSettings) {
      return new RecordingLocalManagerIPC(
        settings.recordingId,
        settings.ffmpegPath,
        settings.recordingsDirPath,
      );
    }

    subscribeMainToRenderer<RecordingManagerSettings, boolean>(
      IPCChannel.RECORDING_IS_EXTRACTED,
      async (settings) => {
        const manager = makeManager(settings);
        return manager.isExtracted();
      },
    );

    subscribeMainToRenderer<
      {
        settings: RecordingManagerSettings;
        target: 'video' | 'blender' | 'folder';
      },
      boolean
    >(IPCChannel.RECORDING_OPEN, async ({settings, target}) => {
      const manager = makeManager(settings);
      switch (target) {
        case 'video':
          manager.openVideo();
          break;
        case 'blender':
          await manager.openInBlender();
          break;
        case 'folder':
          manager.openDir();
          break;
        default:
          throw new Error(`Unknown target`);
      }
      return true;
    });

    subscribeMainToRenderer<
      {
        settings: RecordingManagerSettings;
        links: IByplayAPIResponseRecordingLinks;
      },
      boolean
    >(IPCChannel.RECORDING_DOWNLOAD_AND_EXTRACT, async ({settings, links}) => {
      const manager = makeManager(settings);
      await manager.downloadAndExtract(links);
      return true;
    });
  }
}
