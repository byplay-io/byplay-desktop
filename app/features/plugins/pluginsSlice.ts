import { createSlice, PayloadAction } from '@reduxjs/toolkit';
// eslint-disable-next-line import/no-cycle
import { RootState } from '../../store';

export interface PluginsState {
  installedHoudiniPluginVersion: string | null
}

const pluginsSlice = createSlice({
  name: 'plugins',
  initialState: {
    installedHoudiniPluginVersion: null
  } as PluginsState,
  reducers: {
    setInstalledHoudiniPluginVersion: (state, action: PayloadAction<string>) => {
      state.installedHoudiniPluginVersion = action.payload
    }
  },
});

export const { setInstalledHoudiniPluginVersion } = pluginsSlice.actions;

export default pluginsSlice.reducer;

export const selectInstalledHoudiniPluginVersion = (state: RootState) => state.plugins.installedHoudiniPluginVersion
