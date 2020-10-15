import { promises } from 'fs';

const { app } = require('electron').remote
const {join} = require('path')
const fs = require('fs')

export interface IPersistedPreferences {
  recordingsDir: string | null,
  accessToken: string | null,
  ffmpegPath: string | null
}

const emptyPreferences: IPersistedPreferences = {
  recordingsDir: null,
  accessToken: null,
  ffmpegPath: null
}

export default class Preferences {
  readonly path: string

  constructor() {
    this.path = join(app.getPath('userData'), "preferences.json")
  }

  async set(keyName: keyof IPersistedPreferences, keyValue: string | null) {
    let current = await this.read()
    console.log("Current", current)
    let newValue = { ...current, [keyName]: keyValue }
    let newContent = JSON.stringify(newValue)
    console.log("storing preferences", newValue)
    await promises.writeFile(this.path, newContent, { encoding: "utf-8" })
  }

  async read(): Promise<IPersistedPreferences> {
    if(!fs.existsSync(this.path)) {
      return emptyPreferences
    }
    let content = await promises.readFile(this.path, "utf-8")
    let parsed = JSON.parse(content)
    console.log("parsed", parsed)
    return {
      ...emptyPreferences,
      ...parsed
    } as IPersistedPreferences
  }
}
