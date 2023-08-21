import './Plugins.css';
import {useSelector} from 'react-redux';
import {useState} from 'react';
import {selectPluginManifests} from '../../state/plugins';
import {type IByplayPluginManifest} from '../../../types/plugins';
import PluginRegistry from '../../backend/PluginRegistry';
import {PluginTile} from './components/PluginTile';
import AuthenticatedPageContainer from '../../components/AuthenticatedPageContainer';

export function PluginsScreen() {
  const manifests = useSelector(selectPluginManifests) ?? [];

  return (
    <AuthenticatedPageContainer>
      <h1>Plugins</h1>
      <div className="flex flex-row">
        {manifests.map((manifest) => (
          <PluginTile key={manifest.id} manifest={manifest} />
        ))}
      </div>
    </AuthenticatedPageContainer>
  );
}
