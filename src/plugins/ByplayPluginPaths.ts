import path from 'path';
const { app } = require('electron').remote

export interface IByplayPluginPaths {
  tmpDownloadPath: string,
  installDir: string,
  symlinkPath: string
}

export default class ByplayPluginPathManager {
  pluginId: string
  pluginBuildNumber: number

  constructor(pluginId: string, pluginBuildNumber: number) {
    this.pluginId = pluginId
    this.pluginBuildNumber = pluginBuildNumber
  }

  makePaths(): IByplayPluginPaths {
    return {
      tmpDownloadPath: this.tmpDownloadPath(),
      installDir: this.inPluginDir(`v-${this.pluginBuildNumber}`),
      symlinkPath: this.inPluginDir('current')
    }
  }

  private tmpDownloadPath() {
    let filename = `plugin-${this.pluginId}-${this.pluginBuildNumber}.bpldownload`
    return path.join(app.getPath('temp'), filename)
  }

  private inPluginDir(subdir: string) {
    return path.join(
      app.getPath('userData'), 'plugins', this.pluginId, subdir
    )
  }
}
