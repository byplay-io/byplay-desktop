export interface IPersistedPreferences {
  firstLaunchAt: string | null;
  recordingsDir: string | null;
  accessToken: string | null;
  ffmpegPath: string | null;
  userId: string | null;
  houdiniPluginVersion: string | null;
  blenderPluginVersion: string | null;
  c4dPluginVersion: string | null;
}

export const emptyPreferences: IPersistedPreferences = {
  firstLaunchAt: null,
  recordingsDir: null,
  accessToken: null,
  ffmpegPath: null,
  userId: null,
  houdiniPluginVersion: null,
  blenderPluginVersion: null,
  c4dPluginVersion: null,
};
