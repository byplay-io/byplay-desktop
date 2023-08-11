import ByplayPluginPathManager, {
  type IByplayPluginPaths,
} from './ByplayPluginPaths';

import ByplayPluginInstaller from './ByplayPluginInstaller';
import {type IByplayPluginManifest} from '../../../types/plugins';

export default class ByplayPlugin {
  manifest: IByplayPluginManifest;
  paths: IByplayPluginPaths;

  constructor(manifest: IByplayPluginManifest) {
    this.manifest = manifest;
    this.paths = new ByplayPluginPathManager(
      this.manifest.id,
      this.manifest.buildNumber,
    ).makePaths();
  }

  downloadUrl() {
    return this.manifest.downloadUrl
      .replaceAll('{PLUGIN_ID}', this.manifest.id)
      .replaceAll(
        '{PLUGIN_BUILD_NUMBER}',
        this.manifest.buildNumber.toString(),
      );
  }

  makeInstaller() {
    return new ByplayPluginInstaller(this.paths, this.downloadUrl());
  }
}
