import './Plugins.css';
import {useSelector} from 'react-redux';
import {useState} from 'react';
import {selectPluginManifests} from '../../state/plugins';
import {type IByplayPluginManifest} from '../../../types/plugins';
import PluginRegistry from '../../backend/PluginRegistry';
import {PluginTile} from './components/PluginTile';

export function PluginsScreen() {
  const manifests = useSelector(selectPluginManifests) ?? [];

  return (
    <div className="authorized-page-container">
      <h1>Plugins</h1>
      <div className="flex flex-row">
        {manifests.map((manifest) => (
          <PluginTile key={manifest.id} manifest={manifest} />
        ))}
      </div>
    </div>
  );
}
