import ByplayPluginPathManager, { IByplayPluginPaths } from './ByplayPluginPaths';
import ByplayPluginInstaller from './ByplayPluginInstaller';

export interface IByplayPluginManifest {
  id: string,
  humanName: string,
  description: string,
  buildNumber: number,
  downloadUrl: string
}

export default class ByplayPlugin {
  manifest: IByplayPluginManifest
  paths: IByplayPluginPaths

  constructor(manifest: IByplayPluginManifest) {
    this.manifest = manifest
    this.paths = new ByplayPluginPathManager(
      this.manifest.id,
      this.manifest.buildNumber
    ).makePaths()
  }

  makeInstaller() {
    return new ByplayPluginInstaller(
      this.paths,
      this.manifest.downloadUrl
    )
  }


}
