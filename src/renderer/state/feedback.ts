import {createSlice, type PayloadAction} from '@reduxjs/toolkit';
// eslint-disable-next-line import/no-cycle
import {type RootState} from '../../store';

export interface IFeedbackExtraData {
  recordingId?: string | null;
  rating?: number | null;
  videoRating?: number | null;
  trackingRating?: number | null;
  sceneRating?: number | null;
}

export interface FeedbackState {
  open: boolean;
  extra: IFeedbackExtraData | null;
}

const feedback = createSlice({
  name: 'feedback',
  initialState: {
    open: false,
  } as FeedbackState,
  reducers: {
    setFeedbackOpen: (
      state,
      action: PayloadAction<IFeedbackExtraData | null>,
    ) => {
      state.open = true;
      state.extra = action.payload;
    },

    setFeedbackClosed: (state) => {
      state.open = false;
      state.extra = null;
    },

    setFeedbackRating: (
      state,
      action: PayloadAction<[keyof IFeedbackExtraData, number]>,
    ) => {
      const [key, rating] = action.payload;
      state.extra = {
        ...state.extra,
        [key]: rating,
      };
    },
  },
});

export const {setFeedbackClosed, setFeedbackOpen, setFeedbackRating} =
  feedback.actions;

export default feedback.reducer;

export const selectFeedbackOpen = (state: RootState) => state.feedback.open;
export const selectFeedbackExtra = (state: RootState) => state.feedback.extra;
