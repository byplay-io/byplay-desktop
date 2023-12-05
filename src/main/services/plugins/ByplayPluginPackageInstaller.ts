import fs, {promises} from 'fs';
import path from 'path';
import {app} from 'electron';
import {type IByplayPluginPaths} from './ByplayPluginPaths';
import type ByplayPlugin from './ByplayPlugin';

export interface IPackageInstallStatus {
  success: boolean;
  message: string;
  openDir: string | null;
  docsLink: string | null;
}

export default abstract class ByplayPluginPackageInstaller {
  paths: IByplayPluginPaths;
  plugin: ByplayPlugin;
  abstract supportedVersions: string[];
  abstract fileName: string;
  abstract subdirMatcher: (dir: string) => boolean;

  constructor(plugin: ByplayPlugin) {
    this.plugin = plugin;
    this.paths = plugin.paths;
  }

  expandPathsWithVersions = (pluginPath: string): string[] => {
    return this.supportedVersions.map((version) =>
      pluginPath.replace('{V}', version),
    );
  };

  expandMatchingSubdirs = (pluginPath: string): string[] => {
    if (!fs.existsSync(pluginPath)) {
      return [];
    }
    const contents = fs.readdirSync(pluginPath);
    console.log('contents', pluginPath, contents);
    return contents
      .filter(this.subdirMatcher)
      .map((dir) => path.join(pluginPath, dir));
  };

  static isNotEmptyDir(dir: string) {
    if (!fs.existsSync(dir)) {
      return false;
    }
    return fs.readdirSync(dir).length > 0;
  }

  abstract install(): Promise<IPackageInstallStatus>;
  abstract makeFileContent(): string;

  async openDirForManual(): Promise<string> {
    const dir = path.join(app.getPath('temp'), `Byplay_${Date.now()}`);
    fs.mkdirSync(dir);
    await promises.writeFile(
      path.join(dir, this.fileName),
      this.makeFileContent(),
    );
    await promises.writeFile(
      path.join(dir, 'README.txt'),
      this.makeManualInstallReadme(),
    );
    return dir;
  }

  manualInstallationDocLink() {
    return `https://docs.byplay.io/plugins/${this.plugin.manifest.id}/manual_installation.html`;
  }

  makeManualInstallReadme() {
    return (
      `When Byplay plugin auto installation didn't work, you can install it manually. \n` +
      `To see instructions, go to: \n${this.manualInstallationDocLink()}`
    );
  }
}
