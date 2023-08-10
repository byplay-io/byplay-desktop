import {type IByplayAPIResponseRecordingLinks} from './byplayAPI';

export enum IPCChannel {
  PREFERENCES_READ = 'preferences-read',
  PREFERENCES_SET_BATCH = 'preferences-set-batch',
  INFO_GET_APP_VERSION = 'info-get-app-version',
  INFO_GET_PLATFORM = 'info-get-platform',
  AXIOS_REQUEST = 'axios-request',

  RECORDING_OPEN = 'recording-open',
  RECORDING_DOWNLOAD_AND_EXTRACT = 'recording-download-and-extract',
  RECORDING_IS_EXTRACTED = 'recording-is-extracted',
}

export interface MessageM2RRecordingProcessProgress {
  channel: 'recording-process-progress';
  payload: {
    recordingId: string;
    processType: 'download' | 'extract';
    total: number;
    done: number;
  };
}

export interface MessageM2RRecordingProcessStatus {
  channel: 'recording-process-status';
  payload: {
    recordingId: string;
    processType: 'download' | 'extract';
    status: 'started' | 'done' | 'error';
  };
}

export type MessageM2R =
  | MessageM2RRecordingProcessProgress
  | MessageM2RRecordingProcessStatus;

export interface RecordingManagerSettings {
  recordingId: string;
  ffmpegPath: string;
  recordingsDirPath: string;
}

export interface IRecordingManager {
  downloadAndExtract: (
    links: IByplayAPIResponseRecordingLinks,
  ) => Promise<void>;

  openDir: () => void;
  openInBlender: () => void;
  openVideo: () => void;
  isExtracted: () => Promise<boolean>;
}
