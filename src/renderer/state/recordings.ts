import {createSlice, type PayloadAction} from '@reduxjs/toolkit';
// eslint-disable-next-line import/no-cycle
import {type RootState} from '../store';

export interface RecordingsDirState {
  recordingsDirPath: null | string;
}

const initialState: RecordingsDirState = {
  recordingsDirPath: null,
};

const recordings = createSlice({
  name: 'recordingsDir',
  initialState,
  reducers: {
    setRecordingsDirPath: (state, action: PayloadAction<string>) => {
      state.recordingsDirPath = action.payload;
    },
    setEmptyRecordingsDirPath: (state) => {
      state.recordingsDirPath = null;
    },
  },
});

export const {setRecordingsDirPath, setEmptyRecordingsDirPath} =
  recordings.actions;

export default recordings.reducer;

export const selectRecordingsDirPath = (state: RootState) =>
  state.recordings.recordingsDirPath;
