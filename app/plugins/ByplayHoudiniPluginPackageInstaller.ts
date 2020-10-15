import path from "path";
import { promises } from 'fs';
import * as fs from 'fs';
import { IByplayPluginPaths } from './ByplayPluginPaths';
import Preferences from '../Preferences';
const { app } = require('electron').remote

export interface IPackageInstallStatus {
  success: boolean,
  message: string,
  openDir: string | null
}
const supportedVersions = ['17.5', '18.0', '18.5']

export default class ByplayHoudiniPluginPackageInstaller {
  fileName = "Byplay-Houdini.json"
  paths: IByplayPluginPaths
  packageJsonContent: string

  constructor(paths: IByplayPluginPaths) {
    this.paths = paths
    this.packageJsonContent = this.makePackageJsonContent()
  }

  async install(): Promise<IPackageInstallStatus> {
    let installedTo: string[] = []
    for(let dir of this.listAllHoudiniDirs()) {
      console.log("Checking dir", dir)
      if(await this.isValidHoudiniDir(dir)) {
        let jsonPath = this.packageJsonPath(dir)
        await promises.writeFile(jsonPath, this.packageJsonContent)
        installedTo.push(dir)
        console.log("Installed!")
      }
    }
    if(installedTo.length > 0) {
      return {
        success: true,
        message: `Byplay has been installed to:\n${installedTo.join("\n")}`,
        openDir: null
      }
    }

    return {
      success: false,
      message: `We could not find Houdini's preferences folder. Please, put the '${this.fileName}' file in packages folder yourself`,
      openDir: await this.openDirForManual()
    }
  }

  async openDirForManual(): Promise<string> {
    let dir = path.join(app.getPath('temp'), `Byplay_${Date.now()}`)
    fs.mkdirSync(dir)
    await promises.writeFile(path.join(dir, this.fileName), this.packageJsonContent)
    return dir
  }

  packageJsonPath(dir: string): string {
    let packages = path.join(dir, 'packages')
    if(!fs.existsSync(packages)) {
      fs.mkdirSync(packages)
    }
    return path.join(packages, this.fileName)
  }

  async isValidHoudiniDir(dir: string) {
    if(!fs.existsSync(dir)) {
      return false
    }
    return (await promises.readdir(dir)).length > 0
  }

  expandPathsWithVersions(path: string): string[] {
    return supportedVersions.map(
      version => path.replace("{HV}", version)
    )
  }

  listAllHoudiniDirs() {
    let windowsPaths = [
      path.join(app.getPath('home'), 'houdini{HV}'),
      path.join(app.getPath('home'), 'Documents', 'houdini{HV}'),
    ]
    let macPaths = path.join(
      app.getPath('home'),
      'Library/Preferences/houdini/{HV}'
    )
    let linuxPaths = path.join(
      app.getPath('home'),
      'houdini{HV}'
    )
    return [
      windowsPaths,
      macPaths,
      linuxPaths
    ].flat().map(this.expandPathsWithVersions).flat()
  }

  makePackageJsonContent() {
    const templateValue = {
      "recommends": "houdini_version >= '17.5.321'",
      "env": [
        { "BYPLAY_HOUDINI_PLUGIN_PATH": "{{BYPLAY_HOUDINI_PLUGIN_PATH}}" },
        { "BYPLAY_SYSTEM_DATA_PATH": "{{BYPLAY_SYSTEM_DATA_PATH}}" },
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

    const template = JSON.stringify(templateValue, null, 4)

    return template
      .replaceAll(
        "{{BYPLAY_HOUDINI_PLUGIN_PATH}}",
        this.paths.symlinkPath.replace(/\\/g, '/')
      )
      .replaceAll(
        "{{BYPLAY_SYSTEM_DATA_PATH}}",
        new Preferences().path.replace(/\\/g, '/')
      )
  }
}
