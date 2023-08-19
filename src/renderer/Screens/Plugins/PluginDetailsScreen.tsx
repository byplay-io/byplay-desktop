import './Plugins.css';
import {useParams} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import {useState} from 'react';
import {useAutoAnimate} from '@formkit/auto-animate/react';
import {type PluginType} from '../../../types/plugins';
import {
  selectInstalledPluginVersions,
  selectPluginManifests,
  setInstalledPluginVersion,
} from '../../state/plugins';
import {PluginDetailsHeader} from './components/PluginDetailsHeader';
import InstallPluginIcon from './components/assets/install-plugin.svg';
import {AppRoute} from '../routes';
import PluginRegistry from '../../backend/PluginRegistry';

enum PluginStatus {
  INSTALLED,
  NOT_INSTALLED,
  UPDATE_AVAILABLE,
}

function pluginStatus(
  installedVersion: string | null,
  currentVersion: string,
): PluginStatus {
  if (installedVersion == null) {
    return PluginStatus.NOT_INSTALLED;
  }
  if (installedVersion === currentVersion) {
    return PluginStatus.INSTALLED;
  }
  return PluginStatus.UPDATE_AVAILABLE;
}

function buttonText(status: PluginStatus) {
  switch (status) {
    case PluginStatus.INSTALLED:
      return 'Reinstall Plugin';
    case PluginStatus.UPDATE_AVAILABLE:
      return 'Update Plugin';
    case PluginStatus.NOT_INSTALLED:
    default:
      return 'Install Plugin';
  }
}

export function PluginDetailsScreen() {
  const [installMessages, setInstallMessages] = useState<string[]>([]);

  const [messagesRef, _] = useAutoAnimate();

  const params = useParams<{pluginId: PluginType}>();
  const manifest = useSelector(selectPluginManifests)?.find(
    (m) => m.id === params.pluginId,
  );
  const installedVersions = useSelector(selectInstalledPluginVersions);
  const dispatch = useDispatch();
  if (manifest == null) {
    return <div>Plugin not found</div>;
  }

  const install = async () => {
    const res = await PluginRegistry.installPlugin({manifest});
    setInstallMessages(res.messages);
    if (res.success) {
      dispatch(
        setInstalledPluginVersion({
          pluginType: manifest.id,
          version: manifest.buildNumber.toString(),
        }),
      );
    }
  };

  const installedPluginVersion = installedVersions[manifest.id] ?? null;
  const status = pluginStatus(
    installedPluginVersion,
    manifest.buildNumber.toString(),
  );

  return (
    <div>
      <a className="navigation-link" href={AppRoute.PLUGINS}>
        ← Back
      </a>
      <PluginDetailsHeader manifest={manifest} />

      <button type="button" onClick={install} className="plugin-install-button">
        <img src={InstallPluginIcon} alt="install" />
        {buttonText(status)}
      </button>

      <div ref={messagesRef} className="mt-5">
        {installMessages.map((message) => (
          <div key={message} className="my-2">
            <code key={message}>{message}</code>
          </div>
        ))}
      </div>
      {status === PluginStatus.UPDATE_AVAILABLE && (
        <div className="absolute bottom-10 right-10 bg-red shadow-red shadow-2xl-center rounded-full p-5">
          You have an older version installed: {installedPluginVersion}
        </div>
      )}
    </div>
  );
}
