import './Plugins.css';
import {useSelector} from 'react-redux';
import {selectPluginManifests} from '../../state/plugins';
import {PluginTile} from './components/PluginTile';
import AuthenticatedPageContainer from '../../components/AuthenticatedPageContainer';
import UseInAe from './components/UseInAe';

export function PluginsScreen() {
  const manifests = useSelector(selectPluginManifests) ?? [];

  return (
    <AuthenticatedPageContainer>
      <div className="flex flex-row justify-between items-center">
        <h1>Plugins</h1>
        <div className="mt-5 text-light1 text-sm text-light1">
          Missing a plugin?{' '}
          <a
            href="https://discord.gg/Ru8YqFafQD"
            target="_blank"
            className="external-link mt-5"
            rel="noreferrer"
          >
            Tell us on Discord
          </a>
        </div>
      </div>
      <div className="mb-8 w-3/4">
        Plugins are essential part of Byplay. They set up the scene in your 3D
        software, import geometry with camera movement and set background image.
      </div>
      <div className="flex flex-row">
        {manifests.map((manifest) => (
          <PluginTile key={manifest.id} manifest={manifest} />
        ))}
      </div>
      <UseInAe />
    </AuthenticatedPageContainer>
  );
}
