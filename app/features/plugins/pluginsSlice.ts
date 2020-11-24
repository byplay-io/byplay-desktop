import { createSlice, PayloadAction } from '@reduxjs/toolkit';
// eslint-disable-next-line import/no-cycle
import { RootState } from '../../store';

export interface PluginsState {
  installedHoudiniPluginVersion: string | null,
  installedBlenderPluginVersion: string | null,
}

const pluginsSlice = createSlice({
  name: 'plugins',
  initialState: {
    installedHoudiniPluginVersion: null,
    installedBlenderPluginVersion: null,
  } as PluginsState,
  reducers: {
    setInstalledHoudiniPluginVersion: (state, action: PayloadAction<string>) => {
      state.installedHoudiniPluginVersion = action.payload
    },

    setInstalledBlenderPluginVersion: (state, action: PayloadAction<string>) => {
      state.installedBlenderPluginVersion = action.payload
    },
  },
});

export const {
  setInstalledHoudiniPluginVersion,
  setInstalledBlenderPluginVersion
} = pluginsSlice.actions;

export default pluginsSlice.reducer;

export const selectInstalledHoudiniPluginVersion = (state: RootState) => state.plugins.installedHoudiniPluginVersion
export const selectInstalledBlenderPluginVersion = (state: RootState) => state.plugins.installedBlenderPluginVersion
