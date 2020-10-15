import { createSlice, PayloadAction } from '@reduxjs/toolkit';
// eslint-disable-next-line import/no-cycle
import { RootState } from '../../store';

export interface RecordingsDirState {
  recordingsDirPath: null | string
}

const recordingsDirSlice = createSlice({
  name: 'recordingsDir',
  initialState: {
    recordingsDirPath: null
  } as RecordingsDirState,
  reducers: {
    setRecordingsDirPath: (state, action: PayloadAction<string>) => {
      state.recordingsDirPath = action.payload
    },
    setEmptyRecordingsDirPath: (state) => {
      state.recordingsDirPath = null
    }
  },
});

export const { setRecordingsDirPath, setEmptyRecordingsDirPath } = recordingsDirSlice.actions;

export default recordingsDirSlice.reducer;

export const selectRecordingsDirPath = (state: RootState) => state.recordingsDir.recordingsDirPath;
