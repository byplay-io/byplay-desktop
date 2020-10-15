import path from 'path';
import { remote } from 'electron';
const IS_PROD = process.env.NODE_ENV === 'production';
const { getAppPath } = remote.app;
const isPackaged =
  process.mainModule && process.mainModule.filename.indexOf('app.asar') !== -1;

import { platform } from 'os';

export enum Platform {
  MAC = "mac",
  WINDOWS = "win",
  LINUX = "linux"
}

export function getPlatform(): Platform {
  switch (platform()) {
    case 'aix':
    case 'freebsd':
    case 'linux':
    case 'openbsd':
    case 'android':
      return Platform.LINUX;
    case 'darwin':
    case 'sunos':
      return Platform.MAC;
    case 'win32':
      return Platform.WINDOWS;
  }
  throw "Unknown platform"
};

let currentPlatform = getPlatform();
const binariesPath =
  IS_PROD && isPackaged
    ? path.join(path.dirname(getAppPath()), '..', './Resources', './bin')
    : path.join(getAppPath(), '../build', currentPlatform, './bin');


let ffmpegExecFilename = 'ffmpeg'
if(currentPlatform == "win") ffmpegExecFilename += ".exe"
export const ffmpegPath =
  path.resolve(path.join(binariesPath, ffmpegExecFilename));
