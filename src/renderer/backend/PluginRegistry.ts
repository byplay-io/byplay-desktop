import pluginUrls from '../../main/services/plugins/plugin-manifest-urls.json';
import {type IByplayPluginManifest} from '../../types/plugins';
import {makeRequest} from './ByplayAPIClient';
import {
  IPCChannel,
  type IPluginInstallRequest,
  type IPluginInstallResponse,
} from '../../types/ipc';
import {sendRendererToMain} from '../../utils/ipcCommunication';

const PluginRegistry = {
  async getManifests(): Promise<IByplayPluginManifest[]> {
    const manifestData = pluginUrls.map(async ([_pluginName, url]) =>
      makeRequest<IByplayPluginManifest>({url, method: 'GET'}),
    );
    const manifests = (await Promise.all(manifestData)).map(
      (resp) => resp.data,
    );
    return manifests;
  },

  async installPlugin(
    req: IPluginInstallRequest,
  ): Promise<IPluginInstallResponse> {
    const res = await sendRendererToMain<
      IPluginInstallRequest,
      IPluginInstallResponse
    >(IPCChannel.PLUGIN_INSTALL, req);
    return res;
  },
};

export default PluginRegistry;
