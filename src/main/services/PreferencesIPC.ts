import fs, {promises} from 'fs';

import {join} from 'path';

import {error, info} from 'electron-log';
import {
  emptyPreferences,
  type IPersistedPreferences,
} from '../../types/preferences';
import {subscribeMainToRenderer} from './ipcCommunicationMain';
import {IPCChannel} from '../../types/ipc';

export default class PreferencesIPC {
  readonly path: string;

  constructor() {
    // eslint-disable-next-line global-require,@typescript-eslint/no-var-requires
    const {app} = require('electron');

    this.path = join(app.getPath('userData'), 'preferences.json');
  }

  async set(keyName: keyof IPersistedPreferences, keyValue: string | null) {
    await this.setBatch({[keyName]: keyValue});
  }

  async setBatch(data: Partial<IPersistedPreferences>) {
    const current = await this.read();
    info('Current preferences', current);
    const newValue: IPersistedPreferences = {...current, ...data};
    const newContent = JSON.stringify(newValue);
    info('Storing preferences', newValue);
    await promises.writeFile(this.path, newContent, {encoding: 'utf-8'});
    return newValue;
  }

  async read(): Promise<IPersistedPreferences> {
    if (!fs.existsSync(this.path)) {
      return emptyPreferences;
    }
    try {
      const content = await promises.readFile(this.path, 'utf-8');
      info('config content', content);
      const parsed = JSON.parse(content);
      return {
        ...emptyPreferences,
        ...parsed,
      } satisfies IPersistedPreferences;
    } catch (e) {
      // Sentry.captureException(e);
      error('Exception while reading config, falling back to empty');
      return emptyPreferences;
    }
  }

  static subscribe() {
    const preferences = new PreferencesIPC();

    subscribeMainToRenderer<
      Partial<IPersistedPreferences>,
      IPersistedPreferences
    >(IPCChannel.PREFERENCES_SET_BATCH, async (data) => {
      const res = await preferences.setBatch(data);
      return res;
    });

    subscribeMainToRenderer<null, IPersistedPreferences>(
      IPCChannel.PREFERENCES_READ,
      async () => {
        const res = await preferences.read();
        return res;
      },
    );
  }
}
