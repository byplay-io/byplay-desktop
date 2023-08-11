import {createSlice, type PayloadAction} from '@reduxjs/toolkit';
// eslint-disable-next-line import/no-cycle
import {type RootState} from '../store';
import {type IByplayPluginManifest} from '../../types/plugins';

export interface PluginsState {
  manifests: IByplayPluginManifest[] | null;
  installedHoudiniPluginVersion: string | null;
  installedBlenderPluginVersion: string | null;
  installedC4DPluginVersion: string | null;
}

const initialState: PluginsState = {
  manifests: null,
  installedHoudiniPluginVersion: null,
  installedC4DPluginVersion: null,
  installedBlenderPluginVersion: null,
};

const plugins = createSlice({
  name: 'plugins',
  initialState,
  reducers: {
    setInstalledHoudiniPluginVersion: (
      state,
      action: PayloadAction<string>,
    ) => {
      state.installedHoudiniPluginVersion = action.payload;
    },

    setInstalledC4DPluginVersion: (state, action: PayloadAction<string>) => {
      state.installedC4DPluginVersion = action.payload;
    },

    setInstalledBlenderPluginVersion: (
      state,
      action: PayloadAction<string>,
    ) => {
      state.installedBlenderPluginVersion = action.payload;
    },

    setPluginManifests: (
      state,
      action: PayloadAction<IByplayPluginManifest[]>,
    ) => {
      state.manifests = action.payload;
    },
  },
});

export const {
  setInstalledHoudiniPluginVersion,
  setInstalledC4DPluginVersion,
  setInstalledBlenderPluginVersion,
  setPluginManifests,
} = plugins.actions;

export default plugins.reducer;

export const selectInstalledHoudiniPluginVersion = (state: RootState) =>
  state.plugins.installedHoudiniPluginVersion;
export const selectInstalledBlenderPluginVersion = (state: RootState) =>
  state.plugins.installedBlenderPluginVersion;
export const selectInstalledC4DPluginVersion = (state: RootState) =>
  state.plugins.installedC4DPluginVersion;

export const selectPluginManifests = (state: RootState) =>
  state.plugins.manifests;
