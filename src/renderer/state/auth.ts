import {createSlice, type PayloadAction} from '@reduxjs/toolkit';
// eslint-disable-next-line import/no-cycle
import {type RootState} from '../../store';

export interface TmpSignInCode {
  code: string;
  checkToken: string;
}

export interface AuthState {
  tmpSignInCode: TmpSignInCode | null;
  accessToken: string | null;
}

const initialState: AuthState = {
  tmpSignInCode: null,
  accessToken: null,
};

const auth = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setTmpSignInCode: (state, action: PayloadAction<TmpSignInCode>) => {
      state.tmpSignInCode = action.payload;
    },

    setAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
      state.tmpSignInCode = null;
    },

    setEmptyAccessToken: (state) => {
      state.accessToken = null;
      state.tmpSignInCode = null;
    },
  },
});

export const {setAccessToken, setTmpSignInCode, setEmptyAccessToken} =
  auth.actions;

export default auth.reducer;

export const selectAccessToken = (state: RootState) => state.auth.accessToken;
export const selectIsAuthorized = (state: RootState) =>
  !!state.auth.accessToken;
export const selectTmpSignInCode = (state: RootState) =>
  state.auth.tmpSignInCode;
