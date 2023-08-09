import {
  emptyPreferences,
  type IPersistedPreferences,
} from '../types/preferences';
import {sendRendererToMain} from './ipcCommunication';
import {IPCChannel} from '../types/ipc';

const Preferences = {
  async clear() {
    await this.setBatch(emptyPreferences);
  },

  async set(keyName: keyof IPersistedPreferences, keyValue: string | null) {
    await this.setBatch({[keyName]: keyValue});
  },

  async setBatch(data: Partial<IPersistedPreferences>) {
    const res = await sendRendererToMain<
      Partial<IPersistedPreferences>,
      IPersistedPreferences
    >(IPCChannel.PREFERENCES_SET_BATCH, data);
    return res;
  },

  async read(): Promise<IPersistedPreferences> {
    const res = await sendRendererToMain<null, IPersistedPreferences>(
      IPCChannel.PREFERENCES_READ,
      null,
    );
    return res;
  },
};

export default Preferences;
