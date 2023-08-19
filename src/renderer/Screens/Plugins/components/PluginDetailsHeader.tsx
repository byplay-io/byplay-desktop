import IconHeaderBlender from './assets/header-blender.svg';
import IconHeaderHoudini from './assets/header-houdini.svg';
import IconHeaderC4D from './assets/header-c4d.svg';
import {
  type IByplayPluginManifest,
  PluginType,
} from '../../../../types/plugins';

const headerIcons = {
  [PluginType.Blender]: IconHeaderBlender,
  [PluginType.Houdini]: IconHeaderHoudini,
  [PluginType.Cinema4D]: IconHeaderC4D,
};

export function PluginDetailsHeader(props: {manifest: IByplayPluginManifest}) {
  const {manifest} = props;
  return (
    <div className="flex flex-row">
      <img src={headerIcons[manifest.id]} className="plugin-header" />
      <div className="flex flex-col pt-5">
        <div className="text-2xl">{manifest.humanName}</div>
        <div className="text-primary">Version {manifest.buildNumber}</div>
      </div>
    </div>
  );
}
