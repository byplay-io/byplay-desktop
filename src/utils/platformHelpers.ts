export enum Platform {
  MAC = 'mac',
  WINDOWS = 'win',
  LINUX = 'linux',
}

export function mapPlatform(platform: string): Platform {
  switch (platform) {
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
    default:
      throw new Error('Unknown platform');
  }
}
