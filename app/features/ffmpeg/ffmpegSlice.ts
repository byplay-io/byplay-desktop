import { createSlice, PayloadAction } from '@reduxjs/toolkit';
// eslint-disable-next-line import/no-cycle
import { RootState } from '../../store';

export interface FfmpegState {
  path: null | string
}

const ffmpegSlice = createSlice({
  name: 'ffmpeg',
  initialState: {
    path: null,
  } as FfmpegState,
  reducers: {
    setFFMPEGPath: (state, action: PayloadAction<string>) => {
      state.path = action.payload
    }
  },
});

export const { setFFMPEGPath } = ffmpegSlice.actions;

export default ffmpegSlice.reducer;

export const selectFfmpegPath = (state: RootState) => state.ffmpeg.path
