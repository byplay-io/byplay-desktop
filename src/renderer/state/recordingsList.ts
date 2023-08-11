import {
  createSelector,
  createSlice,
  type PayloadAction,
} from '@reduxjs/toolkit';
// eslint-disable-next-line import/no-cycle
import {type RootState} from '../store';
import {
  type IRecordingEntry,
  type IRecordingsListResponse,
  type RecordingManifestData,
} from '../../types/byplayAPI';

export enum ProcessState {
  NOT_STARTED = 'NOT_STARTED',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
}

export enum RecordingState {
  NOT_STARTED = 'NOT_STARTED',
  IN_PROGRESS = 'IN_PROGRESS',
  EXTRACTED = 'EXTRACTED',
}

export interface IRecording {
  id: string;
  recordingManifest: RecordingManifestData;
  thumbnailUrl: string;
}

export interface IRecordingStatus {
  state: RecordingState;
  downloadState: ProcessState;
  downloadProgress?: {total: number; downloaded: number};
  extractState: ProcessState;
  extractedFrames?: number;
}

export const RecordingNotStartedStatus: IRecordingStatus = {
  state: RecordingState.NOT_STARTED,
  downloadState: ProcessState.NOT_STARTED,
  extractState: ProcessState.NOT_STARTED,
};

export interface RecordingsListState {
  processingCount: number;
  recordings: IRecording[] | null;
  statuses: Record<string, IRecordingStatus>;
  view: 'grid' | 'list';
  filter: 'all' | 'extracted' | 'not_extracted';
  highlightedRecordingId: string | null;
}

const initialState: RecordingsListState = {
  recordings: null,
  processingCount: 0,
  statuses: {},
  view: 'grid',
  filter: 'all',
  highlightedRecordingId: null,
};

const recordingsList = createSlice({
  name: 'recordingsList',
  initialState,
  reducers: {
    setHighlightedRecordingId: (
      state,
      action: PayloadAction<RecordingsListState['highlightedRecordingId']>,
    ) => {
      state.highlightedRecordingId = action.payload;
    },

    setRecordingsView: (
      state,
      action: PayloadAction<RecordingsListState['view']>,
    ) => {
      state.view = action.payload;
    },

    setRecordingsFilter: (
      state,
      action: PayloadAction<RecordingsListState['filter']>,
    ) => {
      state.filter = action.payload;
    },

    setRecordingsListFromServer: (
      state,
      action: PayloadAction<IRecordingsListResponse>,
    ) => {
      const recs = ([] as IRecording[]).concat(action.payload.recordings);
      recs.sort(
        (a, b) =>
          b.recordingManifest.createdAtTimestamp -
          a.recordingManifest.createdAtTimestamp,
      );
      state.recordings = recs;
      state.processingCount = action.payload.processing_count;
    },

    setRecordingStatusDownloading(
      state,
      action: PayloadAction<{
        recordingId: string;
        downloadProgress: {total: number; downloaded: number};
      }>,
    ) {
      state.statuses[action.payload.recordingId] = {
        state: RecordingState.IN_PROGRESS,
        downloadState: ProcessState.IN_PROGRESS,
        extractState: ProcessState.NOT_STARTED,
        downloadProgress: action.payload.downloadProgress,
      };
    },

    setRecordingStatusDownloaded: (state, action: PayloadAction<string>) => {
      state.statuses[action.payload] = {
        state: RecordingState.IN_PROGRESS,
        downloadState: ProcessState.DONE,
        extractState: ProcessState.NOT_STARTED,
      };
    },

    removeRecordingFromList: (state, action: PayloadAction<string>) => {
      if (state.recordings != null) {
        state.recordings = state.recordings.filter(
          (r) => r.id !== action.payload,
        );
      }
    },

    setRecordingStatusExtracting(
      state,
      action: PayloadAction<{recordingId: string; extractedFrames: number}>,
    ) {
      state.statuses[action.payload.recordingId] = {
        state: RecordingState.IN_PROGRESS,
        downloadState: ProcessState.DONE,
        extractState: ProcessState.IN_PROGRESS,
        extractedFrames: action.payload.extractedFrames,
      };
    },

    setRecordingStatusExtracted: (state, action: PayloadAction<string>) => {
      state.statuses[action.payload] = {
        state: RecordingState.EXTRACTED,
        downloadState: ProcessState.DONE,
        extractState: ProcessState.DONE,
      };
    },

    setRecordingStatusAtLeastNotStarted: (
      state,
      action: PayloadAction<string>,
    ) => {
      if (action.payload in state.statuses) {
        return;
      }
      state.statuses[action.payload] = RecordingNotStartedStatus;
    },

    setRecordingStatusesBulk: (
      state,
      action: PayloadAction<{notStarted: string[]; extracted: string[]}>,
    ) => {
      for (const id of action.payload.notStarted) {
        if (!(id in state.statuses)) {
          state.statuses[id] = RecordingNotStartedStatus;
        }
      }
      for (const id of action.payload.extracted) {
        state.statuses[id] = {
          state: RecordingState.EXTRACTED,
          downloadState: ProcessState.DONE,
          extractState: ProcessState.DONE,
        };
      }
    },
  },
});

export const {
  setRecordingsListFromServer,
  setRecordingStatusDownloading,
  setRecordingStatusExtracted,
  setRecordingStatusesBulk,
  setRecordingStatusAtLeastNotStarted,
  setRecordingStatusExtracting,
  setRecordingStatusDownloaded,
  removeRecordingFromList,
  setRecordingsView,
  setRecordingsFilter,
  setHighlightedRecordingId,
} = recordingsList.actions;
export default recordingsList.reducer;
export const selectProcessingCount = (state: RootState) =>
  state.recordingsList.processingCount;
export const selectRecordingsList = (state: RootState) =>
  state.recordingsList.recordings;
export const selectRecordingStatuses = (state: RootState) =>
  state.recordingsList.statuses;
export const selectRecordingsView = (state: RootState) =>
  state.recordingsList.view;
export const selectRecordingsFilter = (state: RootState) =>
  state.recordingsList.filter;

export const selectHighlightedRecordingId = (state: RootState) =>
  state.recordingsList.highlightedRecordingId;

export const selectRecordingsListFiltered = createSelector(
  selectRecordingsList,
  selectRecordingStatuses,
  selectRecordingsFilter,
  (recordings, statuses, filter): IRecordingEntry[] => {
    if (recordings == null) {
      return [];
    }
    return recordings.filter((r: IRecordingEntry) => {
      const {state} = statuses[r.id] ?? RecordingNotStartedStatus;
      switch (filter) {
        case 'all':
          return true;
        case 'extracted':
          return state === RecordingState.EXTRACTED;
        case 'not_extracted':
          return state !== RecordingState.EXTRACTED;
        default:
          return true;
      }
    });
  },
);

export const selectRecordingsListCountsByFilterType = createSelector(
  selectRecordingsList,
  selectRecordingStatuses,
  (recordings, statuses): Record<RecordingsListState['filter'], number> => {
    const counts = {
      all: (recordings ?? []).length,
      extracted: 0,
      not_extracted: 0,
      pending: 0,
    };
    if (recordings == null) {
      return counts;
    }
    recordings.forEach((r: IRecordingEntry) => {
      const {state} = statuses[r.id] ?? RecordingNotStartedStatus;
      switch (state) {
        case RecordingState.NOT_STARTED:
        case RecordingState.IN_PROGRESS:
          counts.not_extracted += 1;
          return;
        case RecordingState.EXTRACTED:
          counts.extracted += 1;
          return;
        default:
          counts.pending += 1;
      }
    });

    return counts;
  },
);

export const selectHighlightedRecording = createSelector(
  selectHighlightedRecordingId,
  selectRecordingsList,
  selectRecordingStatuses,
  (highlightedRecordingId, recordings, statuses) => {
    if (recordings == null || highlightedRecordingId == null) {
      return {recording: null, status: null};
    }
    const status = statuses[highlightedRecordingId];
    const recording =
      recordings.find(
        (r: IRecordingEntry) => r.id === highlightedRecordingId,
      ) ?? null;
    return {
      recording,
      status,
    };
  },
);
