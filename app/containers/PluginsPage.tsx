import React, { useEffect, useState } from 'react';
import { Box, Button, Flex, Image, Text } from 'rebass';
import PluginRegistry from '../plugins/PluginRegistry';
import ByplayPlugin, { IByplayPluginManifest } from '../plugins/ByplayPlugin';
import ByplayHoudiniPluginPackageInstaller from '../plugins/ByplayHoudiniPluginPackageInstaller';
import { PageContent } from './PageContent';
import { colors } from '../theme';
import ActivityIndicator from '../utils/ActivityIndicator';
import { Analytics, AnalyticsUserEventType } from '../backend/Amplitude';
import Preferences, { IPersistedPreferences } from '../Preferences';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectInstalledHoudiniPluginVersion,
  setInstalledHoudiniPluginVersion,
  selectInstalledBlenderPluginVersion,
  setInstalledBlenderPluginVersion
} from '../features/plugins/pluginsSlice';
import { Action } from 'redux';
import { RootState } from '../store';
import ByplayPluginPackageInstaller from '../plugins/ByplayPluginPackageInstaller';
import ByplayBlenderPluginPackageInstaller from '../plugins/ByplayBlenderPluginPackageInstaller';
import routes from '../constants/routes.json';
import NavLink from '../utils/NavLink';
import ExternalURLLink from '../utils/ExternalURLLink';

interface IPluginStateOps {
  setInstalledVersion: (version: string) => Action,
  selectInstalledVersion: (state: RootState) => string | null,
  preferencesKey: keyof IPersistedPreferences,
  packageInstallerFn: (plugin: ByplayPlugin) => ByplayPluginPackageInstaller,
  logo: string
}

function getPluginStateOps(pluginId: string): IPluginStateOps {
  if(pluginId == "byplay-houdini") {
    return {
      selectInstalledVersion: selectInstalledHoudiniPluginVersion,
      setInstalledVersion: setInstalledHoudiniPluginVersion,
      preferencesKey: 'houdiniPluginVersion',
      packageInstallerFn: (plugin: ByplayPlugin) => new ByplayHoudiniPluginPackageInstaller(plugin),
      logo: "https://storage.googleapis.com/byplay-website/standalone/houdinibadge.png"
    }
  }
  if(pluginId == "byplay-blender") {
    return {
      selectInstalledVersion: selectInstalledBlenderPluginVersion,
      setInstalledVersion: setInstalledBlenderPluginVersion,
      preferencesKey: 'blenderPluginVersion',
      packageInstallerFn: (plugin: ByplayPlugin) => new ByplayBlenderPluginPackageInstaller(plugin),
      logo: "https://storage.googleapis.com/byplay-website/standalone/blender-logo-small.png"
    }
  }
  throw `Plugin ${pluginId} unknown`
}

function HelperBox(props: {manifest: IByplayPluginManifest, installedVersion: string | null}) {
  if(props.manifest.id == "byplay-houdini") {
    return <video autoPlay muted controls>
      <source src={"https://storage.googleapis.com/byplay-website/standalone/houdini_plugin_demo.mov"}/>
    </video>
  }
  if(props.manifest.id == "byplay-blender") {
    return <Box>
      <Box py={2}>
        Go to <ExternalURLLink href={"https://byplay.io/docs/blender"}>https://byplay.io/docs/blender</ExternalURLLink> to learn about the Blender plugin
      </Box>
      <video width={400} autoPlay muted controls>
        <source src={"https://storage.googleapis.com/byplay-website/standalone/blender_plugin_demo.mp4"}/>
      </video>
    </Box>
  }
  return null
}

function PluginBox(props: {manifest: IByplayPluginManifest}) {
  const [logMessages, setLogMessages] = useState<string[]>([])
  const [docsLink, setDocsLink] = useState<string | null>(null)
  const [isInstalling, setIsInstalling] = useState(false)
  const dispatch = useDispatch()
  const version = props.manifest.buildNumber.toString()

  const pluginOps = getPluginStateOps(props.manifest.id)
  const installedVersion = useSelector(pluginOps.selectInstalledVersion)

  const openDirForManual = async () => {
    let plugin = new ByplayPlugin(props.manifest)
    const dir = await pluginOps.packageInstallerFn(plugin).openDirForManual()
    Analytics.registerUserEvent(AnalyticsUserEventType.PLUGIN_MANUAL_INSTALL_CLICKED, props.manifest)
    require('electron').shell.openItem(dir)
  }

  const install = async () => {
    setIsInstalling(true)
    Analytics.registerUserEvent(AnalyticsUserEventType.PLUGIN_INSTALL_CLICKED, props.manifest)

    let messages = []
    let plugin = new ByplayPlugin(props.manifest)
    let installer = plugin.makeInstaller()
    try {
      if (!await installer.isInstalled()) {
        messages.push(`downloading to: '${plugin.paths.installDir}'`)
        await installer.quietInstall()
        Analytics.registerUserEvent(AnalyticsUserEventType.PLUGIN_DOWNLOADED_EXTRACTED, props.manifest)
      } else {
        messages.push(`already downloaded to: '${plugin.paths.installDir}'`)
        Analytics.registerUserEvent(AnalyticsUserEventType.PLUGIN_ALREADY_DOWNLOADED_EXTRACTED, props.manifest)
      }
      let installerResult = await pluginOps.packageInstallerFn(plugin).install()

      Analytics.registerUserEvent(AnalyticsUserEventType.PLUGIN_PACKAGE_INSTALLED, {...props.manifest, ...installerResult})
      if (installerResult.message) {
        messages.push(installerResult.message)
      }
      if (installerResult.success) {
        new Preferences().set(pluginOps.preferencesKey, version)
        dispatch(pluginOps.setInstalledVersion(version))
      }
      setDocsLink(installerResult.docsLink)
      if (installerResult.openDir) {
        require('electron').shell.openItem(installerResult.openDir)
      }
      setLogMessages(logMessages.concat(messages))
      setIsInstalling(false)
    } catch (e) {
      setLogMessages(logMessages.concat(messages))

      Analytics.registerUserEvent(
        AnalyticsUserEventType.PLUGIN_INSTALL_FAILED, {
          ...props.manifest,
          error: e.message
        }
      )

      setIsInstalling(false)
      throw e
    }
  }

  const canOpenForManual = installedVersion &&
    installedVersion == version

  return <Flex bg={colors.secondaryBg} flexDirection={"row"} mb={4}>
    <Box width={350} py={3} pl={3} mr={3}>
      <Flex flexDirection={"row"}>
        <Box width={50} pt={1}>
          <Image src={pluginOps.logo} width={40} />
        </Box>
        <Box>
          <Text fontFamily={"monospace"} pb={2}>
            {props.manifest.humanName}
          </Text>
          <Text>
            Version: {props.manifest.buildNumber}
          </Text>
        </Box>
      </Flex>

      { installedVersion && installedVersion !== version ?
        <Flex my={2} style={{borderColor: colors.danger, borderWidth: 1, borderStyle: "solid"}} p={2}>
          <Text>You have and older version installed: {installedVersion}</Text>
        </Flex>
        : null}
      <Box my={2}>
        <Button variant={"outline"} onClick={install} disabled={isInstalling}>
          {isInstalling ? <ActivityIndicator /> : null}
          {installedVersion == version ? "Reinstall" : "Install"}
        </Button>
      </Box>
      {canOpenForManual ? <Box my={2}>
        <Button variant={"outline"} onClick={openDirForManual}>
          Install manually
        </Button>
      </Box> : null}
      {(logMessages.length > 0 || docsLink) ?
        <Box style={{border: "1px dashed #777"}} p={2}>
          {logMessages.map((v, i) =>
              <Text fontSize={1} key={"k-" + i}>{v}</Text>)}
          {docsLink ? <ExternalURLLink href={docsLink}>See docs</ExternalURLLink> : null}
        </Box> : null}
    </Box>
    <Box width={400} p={3}>
      <HelperBox
        manifest={props.manifest}
        installedVersion={installedVersion}
      />
    </Box>
  </Flex>
}

export default function PluginsPage() {
  let [manifests, setManifests] = useState<IByplayPluginManifest[] | null>(null)
  useEffect(() => {
    let registry = new PluginRegistry()
    registry.getManifests().then(setManifests)
  }, [])

  useEffect(() => {
    Analytics.registerUserEvent(AnalyticsUserEventType.PLUGINS_PAGE_OPENED)
  }, [])

  return <PageContent title={"Plugins"}>
    <Box maxWidth={800}>
      <Text color={"muted"}>
        Byplay has plugins and exported files that simplify your workflow in VFX packages.
      </Text>
      <Box my={3}>
        <Flex>
          <Text fontWeight={"bold"}>Houdini</Text>
        </Flex>
        <Text>
          Install the plugin below
        </Text>
      </Box>
      <Box my={3}>
        <Flex>
          <Text fontWeight={"bold"}>Cinema4D</Text>
        </Flex>
        <Text>
          In every video folder you can find "c4d_scene.fbx" file that contains point cloud and animated camera
        </Text>
      </Box>
      <Box my={3}>
        <Flex>
          <Text fontWeight={"bold"}>After Effects</Text>
        </Flex>
        <Text>
          In every video folder you can find "ae_scene.jsx". In AE: "File - Scripts - Run Script File", then choose ae_scene.jsx <br />
          See the <ExternalURLLink href={"https://www.youtube.com/watch?v=SfjIaYS8ChE"}>one-minute tutorial</ExternalURLLink>
        </Text>
      </Box>
      <Box my={3}>
        <Flex>
          <Text fontWeight={"bold"}>Blender</Text>
        </Flex>
        <Text>
          Install the plugin below.<br />
          Also, for every video you can find a .blend file that contains a point cloud, animated camera and is set up to use background images<br />
          Simply click "Open in Blender"
        </Text>
      </Box>
      <hr />

      {manifests == null ?
        <ActivityIndicator /> :
        <Box>
          <h3>Available plugins ({manifests.length}):</h3>
          {manifests.map(manifest => <PluginBox key={manifest.id} manifest={manifest} />)}
        </Box>}
    </Box>

    <Box p={2}>
      <NavLink title={"Continue ->"} to={routes.RECORDINGS_LIST} />
    </Box>
  </PageContent>
}
