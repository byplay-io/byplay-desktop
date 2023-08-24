import {
  type IByplayPluginManifest,
  PluginType,
} from '../../../../types/plugins';

const videoUrl: Record<PluginType, string> = {
  [PluginType.Houdini]:
    'https://storage.googleapis.com/byplay-website/standalone/houdini_plugin_demo.mov',
  [PluginType.Blender]:
    'https://storage.googleapis.com/byplay-website/standalone/blender_plugin_demo.mp4',
  [PluginType.Cinema4D]:
    'https://storage.googleapis.com/byplay-website/standalone/c4d_plugin_demo.mov',
};

export default function PluginHelp(props: {manifest: IByplayPluginManifest}) {
  const {manifest} = props;
  return (
    <video width={400} autoPlay muted controls>
      <source src={videoUrl[manifest.id]} />
    </video>
  );
}
