import { info, error } from 'electron-log';
import { promises } from 'fs';

const {join} = require('path')
const fs = require('fs')
const Sentry = require('@sentry/electron/dist/renderer')

export interface IPersistedPreferences {
  firstLaunchAt: string | null,
  recordingsDir: string | null,
  accessToken: string | null,
  ffmpegPath: string | null,
  userId: string | null,
  houdiniPluginVersion: string | null,
  blenderPluginVersion: string | null,
}

const emptyPreferences: IPersistedPreferences = {
  firstLaunchAt: null,
  recordingsDir: null,
  accessToken: null,
  ffmpegPath: null,
  userId: null,
  houdiniPluginVersion: null,
  blenderPluginVersion: null,
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
    try {
      let content = await promises.readFile(this.path, "utf-8")
      info("config content", content)
      let parsed = JSON.parse(content)
      return {
        ...emptyPreferences,
        ...parsed
      } as IPersistedPreferences
    } catch (e) {
      Sentry.captureException(e)
      error("Exception while reading config, falling back to empty")
      return emptyPreferences
    }
  }
}
