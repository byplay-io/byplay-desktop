import { IByplayPluginManifest } from './ByplayPlugin';
import pluginUrls from "../constants/plugin-manifest-urls.json"
import {default as axios} from 'axios'
import { info } from 'electron-log';

export default class PluginRegistry {
  async getManifests(): Promise<IByplayPluginManifest[]> {
    let manifests: IByplayPluginManifest[] = []
    for(let [_pluginName, url] of pluginUrls) {
      info("getting", url)
      let manifestData = await axios.get(url)
      manifests.push(manifestData.data as IByplayPluginManifest)
    }
    return manifests
  }
}
