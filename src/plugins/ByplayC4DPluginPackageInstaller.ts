import path, { dirname, join } from 'path';
import { promises } from 'fs';
import * as fs from 'fs';
import Preferences from '../Preferences';
import log, { info, error } from "electron-log";
import ByplayPluginPackageInstaller, { IPackageInstallStatus } from './ByplayPluginPackageInstaller';
const Sentry = require('@sentry/electron/dist/renderer')
const { app } = require('electron').remote

export default class ByplayC4DPluginPackageInstaller extends ByplayPluginPackageInstaller {
  fileName = "py-byplay.pyp"
  supportedVersions = [
    "20", "21", "22", "23", "24", "25"
  ]

  async install(): Promise<IPackageInstallStatus> {
    let installedTo: string[] = []

    try {
      for (let dir of await this.listAllC4DDirs()) {
        info("Checking dir", dir)
        let pluginPath = this.pluginPath(dir)
        await promises.writeFile(pluginPath, this.makeFileContent())
        installedTo.push(dir)
        info("Installed!")
      }
    } catch (e) {
      Sentry.captureException(e)
      error("Exception while installing c4d plugin")
      error(e)
    }

    if(installedTo.length > 0) {
      return {
        success: true,
        message: `Byplay has been installed to:\n${installedTo.join("\n")}`,
        docsLink: null,
        openDir: null,
      }
    }

    return {
      success: false,
      message: `We could not find C4D's plugins folder. Please, install '${this.fileName}' plugin yourself`,
      docsLink: this.manualInstallationDocLink(),
      openDir: await this.openDirForManual()
    }
  }

  pluginPath(dir: string): string {
    let pluginDir = path.join(dir, 'py-byplay')
    if(!fs.existsSync(pluginDir)) {
      fs.mkdirSync(pluginDir)
    }
    return path.join(pluginDir, this.fileName)
  }

  async expandC4DPluginsDirs(maxonPath: string): Promise<string[]> {
    if(!fs.existsSync(maxonPath)) {
      return []
    }
    let dirs = await promises.readdir(maxonPath)
    return dirs
      .filter(dir => dir.startsWith("Maxon Cinema 4D "))
      .map(c4dVersion => path.join(maxonPath, c4dVersion, "plugins"))
  }

  async listAllC4DDirs() {
    let windowsPath = path.join(app.getPath('appData'), "MAXON")
    let windowsPluginPaths = await this.expandC4DPluginsDirs(windowsPath)
    let macOSPath = path.join(
      app.getPath('home'),
      "Library", "Preferences", "MAXON"
    )
    let macosPluginPaths = await this.expandC4DPluginsDirs(macOSPath)
    return macosPluginPaths.concat(windowsPluginPaths)
  }

  makeFileContent() {
    const pluginPath = this.paths.symlinkPath.replace(/\\/g, '/')
    const dataPath = new Preferences().path.replace(/\\/g, '/')
    const logPath = join(
      dirname(log.transports.file.getFile().path),
      "c4d-plugin.log"
    ).replace(/\\/g, '/')

    const pythonTemplate = fs.readFileSync(
      join(
        this.paths.installDir, "plugin_template.pyp"
      )
    ).toString()

    return pythonTemplate
      .replaceAll("{{BYPLAY_LOG_PATH}}", logPath)
      .replaceAll("{{BYPLAY_PLUGIN_PATH}}", pluginPath)
      .replaceAll("{{BYPLAY_DATA_PATH}}", dataPath)
  }
}
