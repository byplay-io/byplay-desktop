import { createSlice, PayloadAction } from '@reduxjs/toolkit';
// eslint-disable-next-line import/no-cycle
import { RootState } from '../../store';

export interface IFeedbackExtraData {
  recordingId?: string | null,
  rating?: number | null,
  videoRating?: number | null,
  trackingRating?: number | null,
  sceneRating?: number | null,
}

export interface FeedbackState {
  open: boolean,
  extra: IFeedbackExtraData | null
}

const feedbackSlice = createSlice({
  name: 'feedback',
  initialState: {
    open: false
  } as FeedbackState,
  reducers: {
    setFeedbackOpen: (state, action: PayloadAction<IFeedbackExtraData | null>) => {
      state.open = true
      state.extra = action.payload
    },

    setFeedbackClosed: (state) => {
      state.open = false
      state.extra = null
    },

    setFeedbackRating: (state, action: PayloadAction<[keyof IFeedbackExtraData, number]>) => {
      let [key, rating] = action.payload
      state.extra = {
        ...state.extra,
        [key]: rating
      }
    },
  },
});

export const { setFeedbackClosed, setFeedbackOpen, setFeedbackRating } = feedbackSlice.actions;

export default feedbackSlice.reducer;

export const selectFeedbackOpen = (state: RootState) => state.feedback.open;
export const selectFeedbackExtra = (state: RootState) => state.feedback.extra;

