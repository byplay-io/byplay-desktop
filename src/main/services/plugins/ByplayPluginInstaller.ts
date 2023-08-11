import * as unzipper from 'unzipper';
import * as fs from 'fs';
import {promises} from 'fs';
import {info} from 'electron-log';
import {type IByplayPluginPaths} from './ByplayPluginPaths';
import {getPlatform, Platform} from '../platformHelpers';
import streamDownload from '../streamDownload';

export default class ByplayPluginInstaller {
  paths: IByplayPluginPaths;
  downloadUrl: string;

  constructor(paths: IByplayPluginPaths, downloadUrl: string) {
    this.paths = paths;
    this.downloadUrl = downloadUrl;
  }

  async isInstalled(): Promise<boolean> {
    if (!fs.existsSync(this.paths.installDir)) {
      return false;
    }
    return (await promises.readdir(this.paths.installDir)).length > 0;
  }

  async quietInstall() {
    await this.download(info);
    await this.extract();
    await this.createSymlink();
  }

  async download(
    onProgress: (total: number, downloaded: number) => void,
  ): Promise<void> {
    return streamDownload(
      this.downloadUrl,
      this.paths.tmpDownloadPath,
      onProgress,
    );
  }

  async extract() {
    const directory = await unzipper.Open.file(this.paths.tmpDownloadPath);
    await directory.extract({path: this.paths.installDir});
    await promises.unlink(this.paths.tmpDownloadPath);
  }

  async createSymlink() {
    if (fs.existsSync(this.paths.symlinkPath)) {
      await fs.promises.unlink(this.paths.symlinkPath);
    }
    await promises.symlink(
      this.paths.installDir,
      this.paths.symlinkPath,
      ByplayPluginInstaller.symlinkType(),
    );
  }

  private static symlinkType() {
    if (getPlatform() === Platform.WINDOWS) {
      return 'junction';
    }
    return 'dir';
  }
}
