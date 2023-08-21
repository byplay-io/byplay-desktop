import {createSlice, type PayloadAction} from '@reduxjs/toolkit';
import {type RootState} from '../store';
// eslint-disable-next-line import/no-cycle

export interface FfmpegState {
  path: null | string;
  progress: number | null;
}

const initialState: FfmpegState = {
  path: null,
  progress: null,
};

const ffmpeg = createSlice({
  name: 'ffmpeg',
  initialState,
  reducers: {
    setFFMPEGPath: (state, action: PayloadAction<string>) => {
      state.path = action.payload;
    },

    setFFMPEGProgress: (state, action: PayloadAction<number>) => {
      state.progress = action.payload;
    },
  },
});

export const {setFFMPEGPath, setFFMPEGProgress} = ffmpeg.actions;

export default ffmpeg.reducer;

export const selectFfmpegPath = (state: RootState) => state.ffmpeg.path;
export const selectFfmpegProgress = (state: RootState) => state.ffmpeg.progress;
