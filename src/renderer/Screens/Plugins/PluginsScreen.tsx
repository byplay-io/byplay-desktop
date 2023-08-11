import {useSelector} from 'react-redux';
import {useState} from 'react';
import {selectPluginManifests} from '../../state/plugins';
import {type IByplayPluginManifest} from '../../../types/plugins';
import PluginRegistry from '../../backend/PluginRegistry';

export function PluginsScreen() {
  const manifests = useSelector(selectPluginManifests) ?? [];
  const [messages, setMessages] = useState<string[]>([]);
  const install = async (manifest: IByplayPluginManifest) => {
    const res = await PluginRegistry.installPlugin({manifest});
    setMessages(res.messages);
  };
  return (
    <div>
      <h1>Plugins</h1>
      {manifests.map((manifest) => (
        <div key={manifest.id}>
          <h2>{manifest.humanName}</h2>
          <button
            onClick={() => {
              install(manifest);
            }}
          >
            Install
          </button>
        </div>
      ))}

      {messages.map((message) => (
        <div key={message}>{message}</div>
      ))}

      <code>{JSON.stringify(manifests)}</code>
    </div>
  );
}
