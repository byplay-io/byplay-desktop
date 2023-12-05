import path, {dirname, join} from 'path';
import {promises} from 'fs';
import * as fs from 'fs';
import log, {info} from 'electron-log';
import {app} from 'electron';
import Preferences from '../PreferencesIPC';
import ByplayPluginPackageInstaller, {
  type IPackageInstallStatus,
} from './ByplayPluginPackageInstaller';

export default class ByplayHoudiniPluginPackageInstaller extends ByplayPluginPackageInstaller {
  fileName = 'Byplay-Houdini.json';
  supportedVersions = [
    '17.5',
    '18.0',
    '18.5',
    '19.0',
    '19.5',
    '20.0',
    '20.5',
    '21.0',
    '21.5',
  ];

  // eslint-disable-next-line class-methods-use-this
  subdirMatcher = (dir: string) => dir.match(/^(\d+\.\d+)$/) !== null;
  async install(): Promise<IPackageInstallStatus> {
    const installedTo: string[] = [];
    const content = this.makeFileContent();
    for (const dir of this.listAllHoudiniDirs()) {
      info('Checking dir', dir);
      if (ByplayPluginPackageInstaller.isNotEmptyDir(dir)) {
        const jsonPath = this.packageJsonPath(dir);
        // eslint-disable-next-line no-await-in-loop
        await promises.writeFile(jsonPath, content);
        installedTo.push(dir);
        info('Installed!');
      }
    }
    if (installedTo.length > 0) {
      return {
        success: true,
        message: `Byplay has been installed to:\n${installedTo.join('\n')}`,
        openDir: null,
        docsLink: null,
      };
    }

    return {
      success: false,
      message: `We could not find Houdini's preferences folder. Please, put the '${this.fileName}' file in packages folder yourself`,
      openDir: await this.openDirForManual(),
      docsLink: this.manualInstallationDocLink(),
    };
  }

  packageJsonPath(dir: string): string {
    const packages = path.join(dir, 'packages');
    if (!fs.existsSync(packages)) {
      fs.mkdirSync(packages);
    }
    return path.join(packages, this.fileName);
  }

  listAllHoudiniDirs() {
    const home = app.getPath('home');
    const windowsPaths = [
      path.join(home, 'houdini{V}'),
      path.join(home, 'Documents', 'houdini{V}'),
    ];
    const macPaths = path.join(home, 'Library/Preferences/houdini/{V}');
    const linuxPaths = path.join(home, 'houdini{V}');

    return [windowsPaths, macPaths, linuxPaths]
      .flat()
      .map(this.expandPathsWithVersions)
      .flat();
  }

  makeFileContent() {
    const pluginPath = this.paths.symlinkPath.replace(/\\/g, '/');
    const dataPath = new Preferences().path.replace(/\\/g, '/');
    const logPath = join(
      dirname(log.transports.file.getFile().path),
      'houdini-plugin.log',
    );
    const templateValue = {
      recommends: "houdini_version >= '17.5.321'",
      env: [
        {BYPLAY_HOUDINI_PLUGIN_PATH: pluginPath},
        {BYPLAY_SYSTEM_DATA_PATH: dataPath},
        {BYPLAY_PLUGIN_LOG_PATH: logPath},
        {
          PYTHONPATH: {
            value: '$BYPLAY_HOUDINI_PLUGIN_PATH/python',
            method: 'append',
          },
        },
        {
          HOUDINI_TOOLBAR_PATH: {
            value: '$BYPLAY_HOUDINI_PLUGIN_PATH/shelves',
            method: 'append',
          },
        },
      ],
      path: '$BYPLAY_HOUDINI_PLUGIN_PATH',
    };

    return JSON.stringify(templateValue, null, 4);
  }
}
