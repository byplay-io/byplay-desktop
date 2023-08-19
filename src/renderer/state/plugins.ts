import {createSlice, type PayloadAction} from '@reduxjs/toolkit';
// eslint-disable-next-line import/no-cycle
import {type RootState} from '../store';
import {type IByplayPluginManifest, type PluginType} from '../../types/plugins';

export interface PluginsState {
  manifests: IByplayPluginManifest[] | null;
  installedPluginVersions: Partial<Record<PluginType, string | null>>;
}

const initialState: PluginsState = {
  manifests: null,
  installedPluginVersions: {},
};

const plugins = createSlice({
  name: 'plugins',
  initialState,
  reducers: {
    setInstalledPluginVersion: (
      state,
      action: PayloadAction<{pluginType: PluginType; version: string}>,
    ) => {
      const {pluginType, version} = action.payload;
      state.installedPluginVersions[pluginType] = version;
    },

    setPluginManifests: (
      state,
      action: PayloadAction<IByplayPluginManifest[]>,
    ) => {
      state.manifests = action.payload;
    },
  },
});

export const {setInstalledPluginVersion, setPluginManifests} = plugins.actions;

export default plugins.reducer;

export const selectInstalledPluginVersions = (state: RootState) =>
  state.plugins.installedPluginVersions;

export const selectPluginManifests = (state: RootState) =>
  state.plugins.manifests;
