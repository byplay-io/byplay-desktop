import {app} from 'electron';
import {platform} from 'os';
import PreferencesIPC from '../main/services/PreferencesIPC';
import {subscribeMainToRenderer} from '../main/services/ipcCommunicationMain';
import {IPCChannel} from '../types/ipc';
import {subscribeAxiosProxy} from '../main/services/axiosProxy';
import RecordingLocalManagerIPC from '../main/services/RecordingLocalManagerIPC';

export default function subscribeMainListeners() {
  PreferencesIPC.subscribe();
  RecordingLocalManagerIPC.subscribe();

  subscribeAxiosProxy();

  subscribeMainToRenderer<null, string>(
    IPCChannel.INFO_GET_APP_VERSION,
    async () => {
      return app.getVersion();
    },
  );

  subscribeMainToRenderer<null, string>(
    IPCChannel.INFO_GET_PLATFORM,
    async () => {
      return platform();
    },
  );
}