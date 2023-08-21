import {dialog} from 'electron';
import {subscribeMainToRenderer} from './ipcCommunicationMain';
import {IPCChannel} from '../../types/ipc';

export function subscribeChooseDirectory() {
  subscribeMainToRenderer<null, string | null>(
    IPCChannel.CHOOSE_DIRECTORY,
    async () => {
      const {canceled, filePaths} = await dialog.showOpenDialog({
        properties: ['openDirectory'],
      });
      if (!canceled && filePaths.length === 1) {
        return filePaths[0];
      }
      return null;
    },
  );
}
