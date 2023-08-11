export enum PluginType {
  Blender = 'byplay-blender',
  Cinema4D = 'byplay-c4d',
  Houdini = 'byplay-houdini',
}

export interface IByplayPluginManifest {
  id: PluginType;
  humanName: string;
  description: string;
  buildNumber: number;
  downloadUrl: string;
}
