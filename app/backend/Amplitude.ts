import amplitude from 'amplitude-js'
import { info } from 'electron-log';
import Preferences from '../Preferences';
import { getPlatform } from '../platformHelpers';

export enum AnalyticsUserEventType {
  APP_LAUNCHED = "launched",
  APP_FIRST_TIME_LAUNCHED = "first time launched",

  APP_UPDATE_DOWNLOADED = "update downloaded",

  TMP_SIGN_IN_TOKEN_ACTIVATED = "tmp sign in code activated",
  RECORDINGS_DIR_SELECTED = "recordings dir selected",
  SETUP_PAGE_RENDERED = "setup page rendered",

  FFMPEG_STARTED_DOWNLOADING = "ffmpeg started downloading",
  FFMPEG_FINISHED_DOWNLOADING = "ffmpeg finished downloading",
  FFMPEG_FAILED_DOWNLOADING = "ffmpeg failed downloading",

  PLUGINS_PAGE_OPENED = "plugins page opened",
  PLUGIN_INSTALL_CLICKED = "plugin install clicked",
  PLUGIN_INSTALL_FAILED = "plugin install failed",
  PLUGIN_DOWNLOADED_EXTRACTED = "plugin downloaded extracted",
  PLUGIN_ALREADY_DOWNLOADED_EXTRACTED = "plugin already downloaded extracted",
  PLUGIN_PACKAGE_INSTALLED = "plugin package installed",

  RECORDINGS_PAGE_RENDERED = "recordings page rendered",
  RECORDING_DOWNLOAD_CLICKED = "recording download clicked",
  RECORDING_OPEN_DIR_CLICKED = "recording open dir clicked",
  RECORDING_OPEN_VIDEO_CLICKED = "recording open video clicked",
  RECORDING_OPEN_BLENDER_CLICKED = "recording open blender clicked",
  RECORDING_DOWNLOADED = "recording downloaded",
  RECORDING_EXTRACTED = "recording extracted",

  SUPPORT_PAGE_RENDERED = "support page rendered",
  SIGN_OUT_CLICKED = "sign out clicked",

  SUPPORT_OPEN_LOGS_CLICKED = "support page open logs clicked",
  SUPPORT_OPEN_DOCS_CLICKED = "support page open docs clicked",
  SUPPORT_WRITE_EMAIL_CLICKED = "support write email clicked",
}

export const Analytics = {
  async setup() {
    amplitude.getInstance().init("5e18757a01b9d84a19dfddb7f0835a28")
    amplitude.getInstance().options.platform = `Desktop ${getPlatform()}`
    amplitude.getInstance().setVersionName(require('electron').remote.app.getVersion())
    console.log("setting up amplitude")
    let preferences = new Preferences()
    let prefData = await preferences.read()

    if(prefData.userId) {
      this.setUserId(prefData.userId)
    }

    let launchedBefore = prefData.firstLaunchAt
    if(launchedBefore) {
      info("LAUNCED BEFORE", launchedBefore)

      this.registerUserEvent(AnalyticsUserEventType.APP_LAUNCHED)
    } else {
      info("NEVER LAUNCED BEFORE")
      this.registerUserEvent(AnalyticsUserEventType.APP_LAUNCHED)
      this.registerUserEvent(AnalyticsUserEventType.APP_FIRST_TIME_LAUNCHED)

      await preferences.set("firstLaunchAt", Date.now().toString())
    }
  },

  registerUserEvent(eventType: AnalyticsUserEventType, data: any = {}) {
    info("Analytics", eventType, JSON.stringify(data))
    amplitude.getInstance().logEvent(`Desktop ${eventType}`, data)
  },

  setUserId(userId: string | null) {
    amplitude.getInstance().setUserId(userId)
  }
}
