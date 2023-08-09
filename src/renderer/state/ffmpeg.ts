import {createSlice, type PayloadAction} from '@reduxjs/toolkit';
// eslint-disable-next-line import/no-cycle
import {type RootState} from '../../store';

export interface FfmpegState {
  path: null | string;
}

const ffmpeg = createSlice({
  name: 'ffmpeg',
  initialState: {
    path: null,
  } as FfmpegState,
  reducers: {
    setFFMPEGPath: (state, action: PayloadAction<string>) => {
      state.path = action.payload;
    },
  },
});

export const {setFFMPEGPath} = ffmpeg.actions;

export default ffmpeg.reducer;

export const selectFfmpegPath = (state: RootState) => state.ffmpeg.path;
