import path, { dirname, join } from 'path';
import { promises } from 'fs';
import * as fs from 'fs';
import Preferences from '../Preferences';
import log, { info } from "electron-log";
import ByplayPluginPackageInstaller, { IPackageInstallStatus } from './ByplayPluginPackageInstaller';
const { app } = require('electron').remote


export default class ByplayHoudiniPluginPackageInstaller extends ByplayPluginPackageInstaller {
  fileName = "Byplay-Houdini.json"
  supportedVersions = ['17.5', '18.0', '18.5']

  async install(): Promise<IPackageInstallStatus> {
    let installedTo: string[] = []
    for(let dir of this.listAllHoudiniDirs()) {
      info("Checking dir", dir)
      if(await this.isNotEmptyDir(dir)) {
        let jsonPath = this.packageJsonPath(dir)
        await promises.writeFile(jsonPath, this.makeFileContent())
        installedTo.push(dir)
        info("Installed!")
      }
    }
    if(installedTo.length > 0) {
      return {
        success: true,
        message: `Byplay has been installed to:\n${installedTo.join("\n")}`,
        openDir: null,
        docsLink: null
      }
    }

    return {
      success: false,
      message: `We could not find Houdini's preferences folder. Please, put the '${this.fileName}' file in packages folder yourself`,
      openDir: await this.openDirForManual(),
      docsLink: this.manualInstallationDocLink()
    }
  }

  packageJsonPath(dir: string): string {
    let packages = path.join(dir, 'packages')
    if(!fs.existsSync(packages)) {
      fs.mkdirSync(packages)
    }
    return path.join(packages, this.fileName)
  }

  listAllHoudiniDirs() {
    const home = app.getPath('home')
    const windowsPaths = [
      path.join(home, 'houdini{V}'),
      path.join(home, 'Documents', 'houdini{V}'),
    ]
    const macPaths = path.join(home, 'Library/Preferences/houdini/{V}')
    const linuxPaths = path.join(home, 'houdini{V}')

    return [
      windowsPaths,
      macPaths,
      linuxPaths
    ].flat().map(this.expandPathsWithVersions).flat()
  }

  makeFileContent() {
    const pluginPath = this.paths.symlinkPath.replace(/\\/g, '/')
    const dataPath = new Preferences().path.replace(/\\/g, '/')
    const logPath = join(dirname(log.transports.file.getFile().path), "houdini-plugin.log")
    const templateValue = {
      "recommends": "houdini_version >= '17.5.321'",
      "env": [
        { "BYPLAY_HOUDINI_PLUGIN_PATH": pluginPath },
        { "BYPLAY_SYSTEM_DATA_PATH": dataPath },
        { "BYPLAY_PLUGIN_LOG_PATH": logPath },
        {
          "PYTHONPATH": {
            "value": "$BYPLAY_HOUDINI_PLUGIN_PATH/python",
            "method": "append"
          }
        },
        {
          "HOUDINI_TOOLBAR_PATH": {
            "value": "$BYPLAY_HOUDINI_PLUGIN_PATH/shelves",
            "method": "append"
          }
        }
      ],
      "path": "$BYPLAY_HOUDINI_PLUGIN_PATH"
    }

    return JSON.stringify(templateValue, null, 4)
  }
}
