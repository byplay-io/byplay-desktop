import {useNavigate} from 'react-router-dom';
import {useSelector} from 'react-redux';
import {
  type IByplayPluginManifest,
  PluginType,
} from '../../../../types/plugins';
import IconTileBlender from './assets/tile-blender.svg';
import IconTileHoudini from './assets/tile-houdini.svg';
import IconTileC4D from './assets/tile-c4d.svg';
import {selectInstalledPluginVersions} from '../../../state/plugins';

const tiles = {
  [PluginType.Blender]: IconTileBlender,
  [PluginType.Houdini]: IconTileHoudini,
  [PluginType.Cinema4D]: IconTileC4D,
};

export function PluginTile(props: {manifest: IByplayPluginManifest}) {
  const {manifest} = props;

  const navigate = useNavigate();
  const installedVersions = useSelector(selectInstalledPluginVersions);
  const installedVersion = installedVersions?.[manifest.id] ?? null;
  const onClick = () => {
    navigate(`/plugins/${manifest.id}`);
  };

  return (
    <div className="w-[200px] mx-4 relative">
      <img
        alt={manifest.humanName}
        src={tiles[manifest.id]}
        onClick={onClick}
        className="plugin-tile"
      />
      {installedVersion !== null && (
        <div className="absolute top-12 left-5 text-primary-lighter text-xs">
          Installed
        </div>
      )}
    </div>
  );
}
