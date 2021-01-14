import { createSlice, PayloadAction } from '@reduxjs/toolkit';
// eslint-disable-next-line import/no-cycle
import { RootState } from '../../store';
import { IRecordingsListResponse, RecordingManifestData } from '../../types/byplayAPI';

export enum ProcessState {
  NOT_STARTED = "NOT_STARTED",
  IN_PROGRESS = "IN_PROGRESS",
  DONE = "DONE",
}

export enum RecordingState {
  NOT_STARTED = "NOT_STARTED",
  IN_PROGRESS = "IN_PROGRESS",
  EXTRACTED = "EXTRACTED"
}

export interface IRecording {
  id: string,
  recordingManifest: RecordingManifestData,
  thumbnailUrl: string,
}

export interface IRecordingStatus {
  state: RecordingState,
  downloadState: ProcessState,
  downloadProgress?: string,
  extractState: ProcessState,
  extractProgress?: string,
}

export const RecordingNotStartedStatus: IRecordingStatus = {
  state: RecordingState.NOT_STARTED,
  downloadState: ProcessState.NOT_STARTED,
  extractState: ProcessState.NOT_STARTED
}

export interface RecordingsListState {
  processingCount: number,
  recordings: IRecording[] | null,
  statuses: {[k: string]: IRecordingStatus}
}

const recordingsListSlice = createSlice({
  name: 'recordingsList',
  initialState: {
    recordings: null,
    processingCount: 0,
    statuses: {}
  } as RecordingsListState,
  reducers: {
    setRecordingsListFromServer: (state, action: PayloadAction<IRecordingsListResponse>) => {
      let recs = ([] as IRecording[]).concat(action.payload.recordings)
      recs.sort(
        (a, b) =>
          b.recordingManifest.createdAtTimestamp - a.recordingManifest.createdAtTimestamp
      )
      state.recordings = recs
      state.processingCount = action.payload.processing_count
    },

    setRecordingStatusDownloading: {
      reducer: (state, action: PayloadAction<{recordingId: string, downloadProgress: string}>) => {
        state.statuses[action.payload.recordingId] = {
          state: RecordingState.IN_PROGRESS,
          downloadState: ProcessState.IN_PROGRESS,
          extractState: ProcessState.NOT_STARTED,
          downloadProgress: action.payload.downloadProgress
        }
      },

      prepare: (recordingId: string, downloadProgress: string = "") => {
        return {
          payload: { recordingId, downloadProgress }
        }
      }
    },

    setRecordingStatusDownloaded: (state, action: PayloadAction<string>) => {
      state.statuses[action.payload] = {
        state: RecordingState.IN_PROGRESS,
        downloadState: ProcessState.DONE,
        extractState: ProcessState.NOT_STARTED,
        downloadProgress: ""
      }
    },

    removeRecordingFromList: (state, action: PayloadAction<string>) => {
      if(state.recordings) {
        state.recordings = state.recordings!!.filter(r => r.id != action.payload)
      }
    },

    setRecordingStatusExtracting: {
      reducer: (state, action: PayloadAction<{recordingId: string, extractProgress: string}>) => {
        state.statuses[action.payload.recordingId] = {
          state: RecordingState.IN_PROGRESS,
          downloadState: ProcessState.DONE,
          downloadProgress: "",
          extractState: ProcessState.IN_PROGRESS,
          extractProgress : action.payload.extractProgress
        }
      },

      prepare: (recordingId: string, extractProgress: string = "") => {
        return {
          payload: { recordingId, extractProgress }
        }
      }
    },

    setRecordingStatusExtracted: (state, action: PayloadAction<string>) => {
      state.statuses[action.payload] = {
        state: RecordingState.EXTRACTED,
        downloadState: ProcessState.DONE,
        extractState: ProcessState.DONE
      }
    },

    setRecordingStatusAtLeastNotStarted: (state, action: PayloadAction<string>) => {
      if(state.statuses[action.payload]) {
        return
      }
      state.statuses[action.payload] = RecordingNotStartedStatus
    }
  },
});

export const {
  setRecordingsListFromServer,
  setRecordingStatusDownloading,
  setRecordingStatusExtracted,
  setRecordingStatusAtLeastNotStarted,
  setRecordingStatusExtracting,
  setRecordingStatusDownloaded,
  removeRecordingFromList
} = recordingsListSlice.actions;
export default recordingsListSlice.reducer
export const selectProcessingCount = (state: RootState) =>
  state.recordingsList.processingCount
export const selectRecordingsList = (state: RootState) =>
  state.recordingsList.recordings
export const selectRecordingStatuses = (state: RootState) =>
  state.recordingsList.statuses
