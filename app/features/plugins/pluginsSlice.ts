import { createSlice, PayloadAction } from '@reduxjs/toolkit';
// eslint-disable-next-line import/no-cycle
import { RootState } from '../../store';

export interface PluginsState {
  installedHoudiniPluginVersion: string | null,
  installedBlenderPluginVersion: string | null,
  installedC4DPluginVersion: string | null,
}

const pluginsSlice = createSlice({
  name: 'plugins',
  initialState: {
    installedHoudiniPluginVersion: null,
    installedC4DPluginVersion: null,
    installedBlenderPluginVersion: null,
  } as PluginsState,
  reducers: {
    setInstalledHoudiniPluginVersion: (state, action: PayloadAction<string>) => {
      state.installedHoudiniPluginVersion = action.payload
    },

    setInstalledC4DPluginVersion: (state, action: PayloadAction<string>) => {
      state.installedC4DPluginVersion = action.payload
    },

    setInstalledBlenderPluginVersion: (state, action: PayloadAction<string>) => {
      state.installedBlenderPluginVersion = action.payload
    },
  },
});

export const {
  setInstalledHoudiniPluginVersion,
  setInstalledC4DPluginVersion,
  setInstalledBlenderPluginVersion
} = pluginsSlice.actions;

export default pluginsSlice.reducer;

export const selectInstalledHoudiniPluginVersion = (state: RootState) => state.plugins.installedHoudiniPluginVersion
export const selectInstalledBlenderPluginVersion = (state: RootState) => state.plugins.installedBlenderPluginVersion
export const selectInstalledC4DPluginVersion = (state: RootState) => state.plugins.installedC4DPluginVersion
