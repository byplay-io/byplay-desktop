import {type Dispatch} from 'redux';
import {
  IPCChannel,
  type IRecordingManager,
  type MessageM2RRecordingProcessProgress,
  type MessageM2RRecordingProcessStatus,
  type RecordingManagerSettings,
} from '../../types/ipc';
import {type IByplayAPIResponseRecordingLinks} from '../../types/byplayAPI';
import {
  sendRendererToMain,
  subscribeRenderFromMain,
} from '../../utils/ipcCommunication';
import {
  setRecordingStatusDownloaded,
  setRecordingStatusDownloading,
  setRecordingStatusExtracted,
  setRecordingStatusExtracting,
} from '../state/recordingsList';

export default class RecordingLocalManager implements IRecordingManager {
  settings: RecordingManagerSettings;

  static subscribeProxyToDispatch(dispatch: Dispatch<any>) {
    const unsubProgress =
      subscribeRenderFromMain<MessageM2RRecordingProcessProgress>(
        'recording-process-progress',
        (msg: MessageM2RRecordingProcessProgress['payload']) => {
          if (msg.processType === 'download') {
            dispatch(
              setRecordingStatusDownloading({
                recordingId: msg.recordingId,
                downloadProgress: {total: msg.total, downloaded: msg.done},
              }),
            );
          }
          if (msg.processType === 'extract') {
            dispatch(
              setRecordingStatusExtracting({
                recordingId: msg.recordingId,
                extractedFrames: msg.done,
              }),
            );
          }
        },
      );

    const unsubStatus =
      subscribeRenderFromMain<MessageM2RRecordingProcessStatus>(
        'recording-process-status',
        (msg: MessageM2RRecordingProcessStatus['payload']) => {
          if (msg.processType === 'download') {
            if (msg.status === 'done') {
              dispatch(setRecordingStatusDownloaded(msg.recordingId));
            }
            if (msg.status === 'started') {
              dispatch(
                setRecordingStatusDownloading({
                  recordingId: msg.recordingId,
                  downloadProgress: {total: -1, downloaded: 0},
                }),
              );
            }
          }
          if (msg.processType === 'extract') {
            if (msg.status === 'done') {
              dispatch(setRecordingStatusExtracted(msg.recordingId));
            }
          }
        },
      );
    return () => {
      console.log('RecordingLocalManager.unsubscribeProxyToDispatch');
      unsubProgress();
      unsubStatus();
    };
  }

  constructor(
    recordingId: string,
    ffmpegPath: string,
    recordingsDirPath: string,
  ) {
    this.settings = {
      recordingId,
      ffmpegPath,
      recordingsDirPath,
    };
  }

  async downloadAndExtract(
    links: IByplayAPIResponseRecordingLinks,
  ): Promise<void> {
    await sendRendererToMain<
      {
        settings: RecordingManagerSettings;
        links: IByplayAPIResponseRecordingLinks;
      },
      boolean
    >(IPCChannel.RECORDING_DOWNLOAD_AND_EXTRACT, {
      settings: this.settings,
      links,
    });
  }

  async isExtracted(): Promise<boolean> {
    const res = await sendRendererToMain<RecordingManagerSettings, boolean>(
      IPCChannel.RECORDING_IS_EXTRACTED,
      this.settings,
    );
    return res;
  }

  openDir(): void {
    this.open('folder');
  }

  openInBlender(): void {
    this.open('blender');
  }

  openVideo(): void {
    this.open('video');
  }

  private open(target: 'video' | 'blender' | 'folder') {
    void sendRendererToMain<
      {settings: RecordingManagerSettings; target: typeof target},
      boolean
    >(IPCChannel.RECORDING_OPEN, {settings: this.settings, target});
  }
}
