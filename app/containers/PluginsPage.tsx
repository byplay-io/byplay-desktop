import React, { useEffect, useState } from 'react';
import { Box, Button, Flex, Text } from 'rebass';
import PluginRegistry from '../plugins/PluginRegistry';
import ByplayPlugin, { IByplayPluginManifest } from '../plugins/ByplayPlugin';
import ByplayHoudiniPluginPackageInstaller from '../plugins/ByplayHoudiniPluginPackageInstaller';
import { PageContent } from './PageContent';
import { colors } from '../theme';
import ActivityIndicator from '../utils/ActivityIndicator';

function PluginBox(props: {manifest: IByplayPluginManifest}) {
  const [logMessages, setLogMessages] = useState<string[]>([])

  const install = async () => {
    let messages = []
    let houdiniPlugin = new ByplayPlugin(props.manifest)
    let installer = houdiniPlugin.makeInstaller()
    try {
      if (!await installer.isInstalled()) {
        messages.push(`downloading to: '${houdiniPlugin.paths.installDir}'`)
        await installer.quietInstall()
      } else {
        messages.push(`already downloaded to: '${houdiniPlugin.paths.installDir}'`)
      }
      let installerResult = await new ByplayHoudiniPluginPackageInstaller(houdiniPlugin.paths).install()
      if (installerResult.message) {
        messages.push(installerResult.message)
      }
      if (installerResult.openDir) {
        const { shell } = require('electron')
        shell.openItem(installerResult.openDir)
      }
      setLogMessages(logMessages.concat(messages))
    } catch (e) {
      setLogMessages(logMessages.concat(messages))
      throw e
    }
  }

  return <Flex bg={colors.secondaryBg} p={3} flexDirection={"column"}>
    <Text fontFamily={"monospace"} pb={2}>
      {props.manifest.humanName}
    </Text>
    <Text>
      Version: {props.manifest.buildNumber}
    </Text>
    <Box my={2}>
      <Button variant={"outline"} onClick={install}>
        Install
      </Button>
    </Box>
    { logMessages.length > 0 ?
      <Box style={{border: "1px dashed #777"}} p={2}>
        {
          logMessages.map((v, i) =>
            <Text fontSize={1} key={"k-" + i}>{v}</Text>
          )
        }
      </Box> : null }
  </Flex>
}

export default function PluginsPage() {
  let [manifests, setManifests] = useState<IByplayPluginManifest[] | null>(null)
  useEffect(() => {
    let registry = new PluginRegistry()
    registry.getManifests().then(setManifests)
  }, [])

  return <PageContent title={"Plugins"}>
    <Box maxWidth={800}>

      <Box my={3}>
        <Flex>
          <Text fontWeight={"bold"}>Cinema4D</Text>
        </Flex>
        <Text>
          In every video folder you can find "c4d_scene.fbx" file that contains point cloud and animated camera</Text>
      </Box>
      <Box my={3}>
        <Flex>
          <Text fontWeight={"bold"}>Blender</Text>
        </Flex>
        <Text>
          For every video you can find a .blend file that contains point cloud, animated camera and is set up to use background images<br />
          Simply click "Open in Blender"
        </Text>
      </Box>
      <hr />
      <Text color={"muted"}>
        Byplay has plugins that simplify your workflow in VFX packages.
      </Text>
      <h3>Available plugins:</h3>
      {manifests == null ? <ActivityIndicator /> :
        manifests.map(manifest => <PluginBox key={manifest.id} manifest={manifest} />)}
    </Box>
  </PageContent>
}
