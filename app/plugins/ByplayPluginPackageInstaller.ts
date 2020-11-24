import { IByplayPluginPaths } from './ByplayPluginPaths';
import fs, { promises } from 'fs';
import ByplayPlugin from './ByplayPlugin';
import path from "path";
const { app } = require('electron').remote

export interface IPackageInstallStatus {
  success: boolean,
  message: string,
  openDir: string | null
}

export default abstract class ByplayPluginPackageInstaller {
  paths: IByplayPluginPaths
  plugin: ByplayPlugin
  abstract supportedVersions: string[]
  abstract fileName: string

  constructor(plugin: ByplayPlugin) {
    this.plugin = plugin
    this.paths = plugin.paths
  }

  expandPathsWithVersions = (path: string): string[] => {
    return this.supportedVersions.map(
      version => path.replace("{V}", version)
    )
  }

  async isNotEmptyDir(dir: string) {
    if(!fs.existsSync(dir)) {
      return false
    }
    return (await promises.readdir(dir)).length > 0
  }


  async install(): Promise<IPackageInstallStatus> {
    throw "Not implemented"
  }

  makeFileContent(): string {
    throw "Not implemented"
  }

  async openDirForManual(): Promise<string> {
    let dir = path.join(app.getPath('temp'), `Byplay_${Date.now()}`)
    fs.mkdirSync(dir)
    await promises.writeFile(
      path.join(dir, this.fileName),
      this.makeFileContent()
    )
    await promises.writeFile(
      path.join(dir, "README.txt"),
      this.makeManualInstallReadme()
    )
    return dir
  }

  makeManualInstallReadme() {
    return `When Byplay plugin auto installation didn't work, you can install it manually. \n` +
      `To see instructions, go to: \n` +
      `https://byplay.io/docs/plugins/${this.plugin.manifest.id}/manual-installation`
  }
}
