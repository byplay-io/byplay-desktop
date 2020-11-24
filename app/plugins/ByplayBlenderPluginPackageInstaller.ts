import path, { dirname, join } from 'path';
import { promises } from 'fs';
import * as fs from 'fs';
import Preferences from '../Preferences';
import log, { info } from "electron-log";
import ByplayPluginPackageInstaller, { IPackageInstallStatus } from './ByplayPluginPackageInstaller';
const { app } = require('electron').remote

export default class ByplayBlenderPluginPackageInstaller extends ByplayPluginPackageInstaller {
  fileName = "byplay_blender_addon.py"
  supportedVersions = [
    "2.80", "2.81", "2.82", "2.83", "2.84",
    "2.90", "2.91", "2.92", "2.93", "2.94"
  ]

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
      }
    }

    return {
      success: false,
      message: `We could not find Blender's Addons folder. Please, install '${this.fileName}' addon yourself`,
      openDir: await this.openDirForManual()
    }
  }

  packageJsonPath(dir: string): string {
    let packages = path.join(dir, 'scripts', 'addons')
    if(!fs.existsSync(packages)) {
      fs.mkdirSync(packages)
    }
    return path.join(packages, this.fileName)
  }

  listAllHoudiniDirs() {
    const appData = app.getPath('appData')
    let windowsPaths = path.join(
      appData,
      "Roaming",
      "Blender Foundation",
      "Blender",
      "{V}"
    )
    let nixPaths = path.join(appData, 'Blender', "{V}")
    return [
      windowsPaths,
      nixPaths
    ].flat().map(this.expandPathsWithVersions).flat()
  }

  makeFileContent() {
    const pluginPath = this.paths.symlinkPath.replace(/\\/g, '/')
    const dataPath = new Preferences().path.replace(/\\/g, '/')
    const logPath = join(dirname(log.transports.file.getFile().path), "blender-plugin.log")

    const pythonTemplate = fs.readFileSync(
      join(
        this.paths.installDir, "byplay", "addon_template.py"
      )
    ).toString()

    return pythonTemplate
      .replaceAll("{{BYPLAY_LOG_PATH}}", logPath)
      .replaceAll("{{BYPLAY_PLUGIN_PATH}}", pluginPath)
      .replaceAll("{{BYPLAY_DATA_PATH}}", dataPath)
  }
}
