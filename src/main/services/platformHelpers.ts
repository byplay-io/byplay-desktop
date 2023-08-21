import {platform} from 'os';

export enum Platform {
  MAC = 'mac',
  WINDOWS = 'win',
  LINUX = 'linux',
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
  throw 'Unknown platform';
}
