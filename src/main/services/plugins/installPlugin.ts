import {shell} from 'electron';
import {info} from 'electron-log';
import {
  type IPluginInstallRequest,
  type IPluginInstallResponse,
} from '../../../types/ipc';
import ByplayPlugin from './ByplayPlugin';
import type ByplayPluginPackageInstaller from './ByplayPluginPackageInstaller';
import ByplayBlenderPluginPackageInstaller from './ByplayBlenderPluginPackageInstaller';
import ByplayHoudiniPluginPackageInstaller from './ByplayHoudiniPluginPackageInstaller';
import ByplayC4DPluginPackageInstaller from './ByplayC4DPluginPackageInstaller';
import {PluginType} from '../../../types/plugins';

const pluginInstallers: Record<
  PluginType,
  (plugin: ByplayPlugin) => ByplayPluginPackageInstaller
> = {
  [PluginType.Blender]: (plugin: ByplayPlugin) =>
    new ByplayBlenderPluginPackageInstaller(plugin),
  [PluginType.Houdini]: (plugin: ByplayPlugin) =>
    new ByplayHoudiniPluginPackageInstaller(plugin),
  [PluginType.Cinema4D]: (plugin: ByplayPlugin) =>
    new ByplayC4DPluginPackageInstaller(plugin),
};

export default async function installPlugin(
  req: IPluginInstallRequest,
): Promise<IPluginInstallResponse> {
  // Analytics.registerUserEvent(AnalyticsUserEventType.PLUGIN_INSTALL_CLICKED, props.manifest)
  info('installPlugin', req.manifest.id);

  const messages = [];
  const plugin = new ByplayPlugin(req.manifest);
  const installer = plugin.makeInstaller();
  try {
    if (!(await installer.isInstalled())) {
      messages.push(`downloading to: '${plugin.paths.installDir}'`);
      await installer.quietInstall();
      // Analytics.registerUserEvent(AnalyticsUserEventType.PLUGIN_DOWNLOADED_EXTRACTED, props.manifest)
    } else {
      messages.push(`already downloaded to: '${plugin.paths.installDir}'`);
      // Analytics.registerUserEvent(AnalyticsUserEventType.PLUGIN_ALREADY_DOWNLOADED_EXTRACTED, props.manifest)
    }
    const pluginInstaller = pluginInstallers[req.manifest.id](plugin);
    const installerResult = await pluginInstaller.install();

    // Analytics.registerUserEvent(AnalyticsUserEventType.PLUGIN_PACKAGE_INSTALLED, {...props.manifest, ...installerResult})
    messages.push(installerResult.message);
    if (installerResult.openDir !== null) {
      void shell.openPath(installerResult.openDir);
    }
    return {
      success: installerResult.success,
      docsLink: installerResult.docsLink,
      messages,
    };
  } catch (e) {
    // Analytics.registerUserEvent(
    //   AnalyticsUserEventType.PLUGIN_INSTALL_FAILED, {
    //     ...props.manifest,
    //     error: e.message
    //   }
    // )
    const err: object = e as object;
    const message = 'message' in err ? (err.message as string) : 'unknown';
    return {
      success: false,
      docsLink: null,
      messages: [`Error while installing plugin: ${message}`],
    };
  }
}
