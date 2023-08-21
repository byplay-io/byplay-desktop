import {useNavigate} from 'react-router-dom';
import {
  type IByplayPluginManifest,
  PluginType,
} from '../../../../types/plugins';
import IconTileBlender from './assets/tile-blender.svg';
import IconTileHoudini from './assets/tile-houdini.svg';
import IconTileC4D from './assets/tile-c4d.svg';

const tiles = {
  [PluginType.Blender]: IconTileBlender,
  [PluginType.Houdini]: IconTileHoudini,
  [PluginType.Cinema4D]: IconTileC4D,
};

export function PluginTile(props: {manifest: IByplayPluginManifest}) {
  const {manifest} = props;

  const navigate = useNavigate();
  const onClick = () => {
    navigate(`/plugins/${manifest.id}`);
  };

  return (
    <div className="w-[200px] mx-4">
      <img src={tiles[manifest.id]} onClick={onClick} className="plugin-tile" />
    </div>
  );
}
