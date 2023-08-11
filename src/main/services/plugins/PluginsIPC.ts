import {subscribeMainToRenderer} from '../ipcCommunicationMain';
import {
  IPCChannel,
  type IPluginInstallRequest,
  type IPluginInstallResponse,
} from '../../../types/ipc';
import installPlugin from './installPlugin';

const PluginsIPC = {
  subscribe() {
    subscribeMainToRenderer<IPluginInstallRequest, IPluginInstallResponse>(
      IPCChannel.PLUGIN_INSTALL,
      installPlugin,
    );
  },
};

export default PluginsIPC;
