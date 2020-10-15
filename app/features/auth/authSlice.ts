import { createSlice, PayloadAction } from '@reduxjs/toolkit';
// eslint-disable-next-line import/no-cycle
import { RootState } from '../../store';

export interface TmpSignInCode {
  code: string,
  checkToken: string
}

export interface AuthState {
  tmpSignInCode: TmpSignInCode | null,
  accessToken: string | null
}

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    tmpSignInCode: null,
    accessToken: null
  } as AuthState,
  reducers: {
    setTmpSignInCode: (state, action: PayloadAction<TmpSignInCode>) => {
      state.tmpSignInCode = action.payload
    },

    setAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload
      state.tmpSignInCode = null
    },

    setEmptyAccessToken: (state) => {
      state.accessToken = null
      state.tmpSignInCode = null
    }
  },
});

export const { setAccessToken, setTmpSignInCode, setEmptyAccessToken } = authSlice.actions;

export default authSlice.reducer;

export const selectAccessToken = (state: RootState) => state.auth.accessToken;
export const selectIsAuthorized = (state: RootState) => !!state.auth.accessToken;
export const selectTmpSignInCode = (state: RootState) => state.auth.tmpSignInCode;
