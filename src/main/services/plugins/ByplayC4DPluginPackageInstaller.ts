import path, {dirname, join} from 'path';
import {promises} from 'fs';
import * as fs from 'fs';
import log, {info, error} from 'electron-log';
import {app} from 'electron';
import Preferences from '../PreferencesIPC';
import ByplayPluginPackageInstaller, {
  type IPackageInstallStatus,
} from './ByplayPluginPackageInstaller';
// const Sentry = require('@sentry/electron/dist/renderer')

export default class ByplayC4DPluginPackageInstaller extends ByplayPluginPackageInstaller {
  fileName = 'py-byplay.pyp';
  supportedVersions = ['20', '21', '22', '23', '24', '25'];

  async install(): Promise<IPackageInstallStatus> {
    const installedTo: string[] = [];

    try {
      for (const dir of await this.listAllC4DDirs()) {
        info('Checking dir', dir);
        const pluginPath = this.pluginPath(dir);
        // eslint-disable-next-line no-await-in-loop
        await promises.writeFile(pluginPath, this.makeFileContent());
        installedTo.push(dir);
        info('Installed!');
      }
    } catch (e) {
      // Sentry.captureException(e);
      error('Exception while installing c4d plugin');
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
      message: `We could not find C4D's plugins folder. Please, install '${this.fileName}' plugin yourself`,
      docsLink: this.manualInstallationDocLink(),
      openDir: await this.openDirForManual(),
    };
  }

  pluginPath(dir: string): string {
    const pluginDir = path.join(dir, 'py-byplay');
    if (!fs.existsSync(pluginDir)) {
      fs.mkdirSync(pluginDir);
    }
    return path.join(pluginDir, this.fileName);
  }

  static ensureDirExists(dir: string) {
    if (!fs.existsSync(dir)) {
      log.info('Creating plugin dir', dir);
      fs.mkdirSync(dir);
    }
    return dir;
  }

  async expandC4DPluginsDirs(maxonPath: string): Promise<string[]> {
    if (!fs.existsSync(maxonPath)) {
      return [];
    }
    const dirs = await promises.readdir(maxonPath);
    return dirs
      .filter((dir) => dir.startsWith('Maxon Cinema 4D '))
      .map((c4dVersion) => path.join(maxonPath, c4dVersion, 'plugins'))
      .map(ByplayC4DPluginPackageInstaller.ensureDirExists);
  }

  async listAllC4DDirs() {
    const windowsPath = path.join(app.getPath('appData'), 'MAXON');
    const windowsPluginPaths = await this.expandC4DPluginsDirs(windowsPath);
    const macOSPath = path.join(
      app.getPath('home'),
      'Library',
      'Preferences',
      'MAXON',
    );
    const macosPluginPaths = await this.expandC4DPluginsDirs(macOSPath);
    return macosPluginPaths.concat(windowsPluginPaths);
  }

  makeFileContent() {
    const pluginPath = this.paths.symlinkPath.replace(/\\/g, '/');
    const dataPath = new Preferences().path.replace(/\\/g, '/');
    const logPath = join(
      dirname(log.transports.file.getFile().path),
      'c4d-plugin.log',
    ).replace(/\\/g, '/');

    const pythonTemplate = fs
      .readFileSync(join(this.paths.installDir, 'plugin_template.pyp'))
      .toString();

    return pythonTemplate
      .replaceAll('{{BYPLAY_LOG_PATH}}', logPath)
      .replaceAll('{{BYPLAY_PLUGIN_PATH}}', pluginPath)
      .replaceAll('{{BYPLAY_DATA_PATH}}', dataPath);
  }
}
