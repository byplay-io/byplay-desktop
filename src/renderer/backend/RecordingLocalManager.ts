import {
  IPCChannel,
  type IRecordingManager,
  type RecordingManagerSettings,
} from '../../types/ipc';
import {type IByplayAPIResponseRecordingLinks} from '../../types/byplayAPI';
import {sendRendererToMain} from '../../utils/ipcCommunication';

export default class RecordingLocalManager implements IRecordingManager {
  settings: RecordingManagerSettings;

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
