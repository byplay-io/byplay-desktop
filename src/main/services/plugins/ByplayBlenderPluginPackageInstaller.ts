import path, {dirname, join} from 'path';
import {promises} from 'fs';
import * as fs from 'fs';
import log, {info, error} from 'electron-log';
import {app} from 'electron';
import Preferences from '../PreferencesIPC';
import ByplayPluginPackageInstaller, {
  type IPackageInstallStatus,
} from './ByplayPluginPackageInstaller';

// const Sentry = require('@sentry/electron/dist/renderer');

export default class ByplayBlenderPluginPackageInstaller extends ByplayPluginPackageInstaller {
  fileName = 'byplay_blender_addon.py';
  // eslint-disable-next-line class-methods-use-this
  subdirMatcher = (dir: string) => dir.match(/^(\d+\.\d+)$/) !== null;

  supportedVersions = [];

  async install(): Promise<IPackageInstallStatus> {
    const installedTo: string[] = [];

    try {
      const content = this.makeFileContent();
      for (const dir of this.listAllBlenderDirs()) {
        info('Checking dir', dir);
        if (ByplayPluginPackageInstaller.isNotEmptyDir(dir)) {
          const jsonPath = this.packageJsonPath(dir);
          // eslint-disable-next-line no-await-in-loop
          await promises.writeFile(jsonPath, content);
          installedTo.push(dir);
          info('Installed!');
        }
      }
    } catch (e) {
      // Sentry.captureException(e);
      error('Exception while installing blender plugin');
      error(e);
    }

    if (installedTo.length > 0) {
      return {
        success: true,
        message: `Byplay has been installed to:\n${installedTo.join('\n')}`,
        docsLink: null,
        openDir: null,
      };
    }

    return {
      success: false,
      message: `We could not find Blender's Addons folder. Please, install '${this.fileName}' addon yourself`,
      docsLink: this.manualInstallationDocLink(),
      openDir: await this.openDirForManual(),
    };
  }

  packageJsonPath(dir: string): string {
    const scripts = path.join(dir, 'scripts');
    const packages = path.join(scripts, 'addons');
    if (!fs.existsSync(scripts)) {
      fs.mkdirSync(scripts);
    }
    if (!fs.existsSync(packages)) {
      fs.mkdirSync(packages);
    }
    return path.join(packages, this.fileName);
  }

  listAllBlenderDirs() {
    const appData = app.getPath('appData');
    const windowsPaths = [
      path.join(appData, 'Roaming', 'Blender Foundation', 'Blender'),
      path.join(appData, 'Blender Foundation', 'Blender'),
    ];
    const nixPaths = path.join(appData, 'Blender');
    return [windowsPaths, nixPaths]
      .flat()
      .map(this.expandMatchingSubdirs)
      .flat();
  }

  makeFileContent() {
    const pluginPath = this.paths.symlinkPath.replace(/\\/g, '/');
    const dataPath = new Preferences().path.replace(/\\/g, '/');
    const logPath = join(
      dirname(log.transports.file.getFile().path),
      'blender-plugin.log',
    ).replace(/\\/g, '/');

    const pythonTemplate = fs
      .readFileSync(join(this.paths.installDir, 'byplay', 'addon_template.py'))
      .toString();

    return pythonTemplate
      .replaceAll('{{BYPLAY_LOG_PATH}}', logPath)
      .replaceAll('{{BYPLAY_PLUGIN_PATH}}', pluginPath)
      .replaceAll('{{BYPLAY_DATA_PATH}}', dataPath);
  }
}
