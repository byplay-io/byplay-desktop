import { info } from 'electron-log';
import { promises } from 'fs';

const {join} = require('path')
const fs = require('fs')

export interface IPersistedPreferences {
  firstLaunchAt: string | null,
  recordingsDir: string | null,
  accessToken: string | null,
  ffmpegPath: string | null,
  userId: string | null,
  houdiniPluginVersion: string | null
}

const emptyPreferences: IPersistedPreferences = {
  firstLaunchAt: null,
  recordingsDir: null,
  accessToken: null,
  ffmpegPath: null,
  userId: null,
  houdiniPluginVersion: null
}

type Partial<T> = {
  [P in keyof T]?: T[P];
};

export default class Preferences {
  readonly path: string

  constructor() {
    const { app } = require('electron').remote
    this.path = join(app.getPath('userData'), "preferences.json")
  }

  async clear() {
    await this.setBatch(emptyPreferences)
  }

  async set(keyName: keyof IPersistedPreferences, keyValue: string | null) {
    await this.setBatch({[keyName]: keyValue})
  }

  async setBatch(data: Partial<IPersistedPreferences>) {
    let current = await this.read()
    info("Current preferences", current)
    let newValue: IPersistedPreferences = { ...current, ...data }
    let newContent = JSON.stringify(newValue)
    info("Storing preferences", newValue)
    await promises.writeFile(this.path, newContent, { encoding: "utf-8" })
  }

  async read(): Promise<IPersistedPreferences> {
    if(!fs.existsSync(this.path)) {
      return emptyPreferences
    }
    let content = await promises.readFile(this.path, "utf-8")
    let parsed = JSON.parse(content)
    info("parsed", parsed)
    return {
      ...emptyPreferences,
      ...parsed
    } as IPersistedPreferences
  }
}
