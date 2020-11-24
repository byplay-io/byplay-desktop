import path, { dirname, join } from 'path';
import { promises } from 'fs';
import * as fs from 'fs';
import Preferences from '../Preferences';
import log, { info } from "electron-log";
import ByplayPluginPackageInstaller, { IPackageInstallStatus } from './ByplayPluginPackageInstaller';
const { app } = require('electron').remote


export default class ByplayHoudiniPluginPackageInstaller extends ByplayPluginPackageInstaller {
  fileName = "Byplay-Houdini.json"
  supportedVersions = ['17.5', '18.0', '18.5']

  async install(): Promise<IPackageInstallStatus> {
    let installedTo: string[] = []
    for(let dir of this.listAllHoudiniDirs()) {
      info("Checking dir", dir)
      if(await this.isNotEmptyDir(dir)) {
        let jsonPath = this.packageJsonPath(dir)
        await promises.writeFile(jsonPath, this.makeFileContent())
        installedTo.push(dir)
        info("Installed!")
      }
    }
    if(installedTo.length > 0) {
      return {
        success: true,
        message: `Byplay has been installed to:\n${installedTo.join("\n")}`,
        openDir: null
      }
    }

    return {
      success: false,
      message: `We could not find Houdini's preferences folder. Please, put the '${this.fileName}' file in packages folder yourself`,
      openDir: await this.openDirForManual()
    }
  }

  packageJsonPath(dir: string): string {
    let packages = path.join(dir, 'packages')
    if(!fs.existsSync(packages)) {
      fs.mkdirSync(packages)
    }
    return path.join(packages, this.fileName)
  }

  listAllHoudiniDirs() {
    const home = app.getPath('home')
    const windowsPaths = [
      path.join(home, 'houdini{V}'),
      path.join(home, 'Documents', 'houdini{V}'),
    ]
    const macPaths = path.join(home, 'Library/Preferences/houdini/{V}')
    const linuxPaths = path.join(home, 'houdini{V}')

    return [
      windowsPaths,
      macPaths,
      linuxPaths
    ].flat().map(this.expandPathsWithVersions).flat()
  }

  makeFileContent() {
    const pluginPath = this.paths.symlinkPath.replace(/\\/g, '/')
    const dataPath = new Preferences().path.replace(/\\/g, '/')
    const logPath = join(dirname(log.transports.file.getFile().path), "houdini-plugin.log")
    const templateValue = {
      "recommends": "houdini_version >= '17.5.321'",
      "env": [
        { "BYPLAY_HOUDINI_PLUGIN_PATH": pluginPath },
        { "BYPLAY_SYSTEM_DATA_PATH": dataPath },
        { "BYPLAY_PLUGIN_LOG_PATH": logPath },
        {
          "PYTHONPATH": {
            "value": "$BYPLAY_HOUDINI_PLUGIN_PATH/python",
            "method": "append"
          }
        },
        {
          "HOUDINI_TOOLBAR_PATH": {
            "value": "$BYPLAY_HOUDINI_PLUGIN_PATH/shelves",
            "method": "append"
          }
        }
      ],
      "path": "$BYPLAY_HOUDINI_PLUGIN_PATH"
    }

    return JSON.stringify(templateValue, null, 4)
  }
}

function f() {
  const { id, type, createdDate, data, version } = {
    "id": "5fbc56c4c086540e9a8abb38",
    "type": "subscription_renewal",
    "createdDate": "2020-11-24T00:41:40.814Z",
    "version": "1.1.0",
    "data": {
      "id": "5fbc56c4c086540e9a8abb35",
      "purchaseDate": "2020-11-24T08:39:30.000Z",
      "quantity": 1,
      "platform": "ios",
      "country": "CH",
      "tags": {},
      "orderId": "590000234212907",
      "app": "5f74bb1418f72b0e8becc8df",
      "user": "5fb38afb6533140e8dfb1d70",
      "product": "5f79ba21b115a50e95bdf41d",
      "receipt": "5fb38c456533140e8dfb1f5c",
      "listing": "5f74bb1418f72b0e8becc8e3",
      "store": "5f74bb1418f72b0e8becc8e5",
      "currency": "CHF",
      "price": 34,
      "convertedCurrency": "USD",
      "convertedPrice": 37.25,
      "isSandbox": false,
      "isRefunded": false,
      "isSubscription": true,
      "isSubscriptionActive": true,
      "isSubscriptionRenewable": true,
      "isSubscriptionRetryPeriod": false,
      "isSubscriptionGracePeriod": false,
      "isTrialConversion": true,
      "subscriptionPeriodType": "normal",
      "expirationDate": "2021-11-24T08:39:30.000Z",
      "linkedPurchase": "5fb38c456533140e8dfb1f5f",
      "originalPurchase": "5fb38c456533140e8dfb1f5f",
      "userId": "MxJ2qjxsjTdFfCxqYp6lrzNv2KL2",
      "productSku": "regular.1year",
      "productType": "renewable_subscription",
      "productGroupName": "Byplay Camera access"
    }
  }
  return `Event: ${type}; ${data.price}${data.currency} [${data.convertedPrice}${data.convertedCurrency}]\nUser: ${data.userId} [${data.country}]; Product: ${data.productSku}; S.active: ${data.isSubscriptionActive}`
}
