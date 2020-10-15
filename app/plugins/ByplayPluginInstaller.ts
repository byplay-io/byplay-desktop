import * as unzipper from 'unzipper'
import * as fs from 'fs'
import {promises} from 'fs'
import Downloader from '../backend/Downloader';
import { IByplayPluginPaths } from './ByplayPluginPaths';

export default class ByplayPluginInstaller {
  paths: IByplayPluginPaths
  downloadUrl: string

  constructor(
    paths: IByplayPluginPaths,
    downloadUrl: string
  ) {
    this.paths = paths
    this.downloadUrl = downloadUrl
  }

  async isInstalled(): Promise<boolean> {
    if(!fs.existsSync(this.paths.installDir)) {
      return false
    }
    return (await promises.readdir(this.paths.installDir)).length > 0
  }

  async quietInstall() {
    await this.download(console.log)
    await this.extract()
    await this.createSymlink()
  }

  download(onProgress: (total: number, downloaded: number) => void): Promise<void> {
    return Downloader.download(this.downloadUrl, this.paths.tmpDownloadPath, onProgress)
  }

  async extract() {
    const directory = await unzipper.Open.file(this.paths.tmpDownloadPath)
    await directory.extract({ path: this.paths.installDir })
    await promises.unlink(this.paths.tmpDownloadPath)
  }

  async createSymlink() {
    if(await fs.existsSync(this.paths.symlinkPath)) {
      await fs.promises.unlink(this.paths.symlinkPath)
    }
    await promises.symlink(
      this.paths.installDir,
      this.paths.symlinkPath,
      'dir'
    )
  }
}
