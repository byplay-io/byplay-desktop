import './Plugins.css';
import {useNavigate, useParams} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import React, {useState} from 'react';
import {useAutoAnimate} from '@formkit/auto-animate/react';
import {
  type IByplayPluginManifest,
  type PluginType,
} from '../../../types/plugins';
import {
  selectInstalledPluginVersions,
  selectPluginManifests,
  setInstalledPluginVersion,
} from '../../state/plugins';
import {PluginDetailsHeader} from './components/PluginDetailsHeader';
import InstallPluginIcon from './components/assets/install-plugin.svg';
import {AppRoute} from '../routes';
import PluginRegistry from '../../backend/PluginRegistry';
import AuthenticatedPageContainer from '../../components/AuthenticatedPageContainer';
import PluginHelp from './components/PluginHelp';

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

  const navigate = useNavigate();

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
    <AuthenticatedPageContainer>
      <a
        className="navigation-link"
        onClick={() => {
          navigate(AppRoute.PLUGINS);
        }}
      >
        ← Back
      </a>
      <PluginDetailsHeader manifest={manifest} />

      <div className="flex flex-row w-full justify-between">
        <div>
          <button
            type="button"
            onClick={install}
            className="big-primary-button"
          >
            <img src={InstallPluginIcon} alt="install" />
            {buttonText(status)}
          </button>

          <div ref={messagesRef} className="mt-5 max-w-[400px]">
            {installMessages.map((message) => (
              <div key={message} className="my-2">
                <code key={message}>{message}</code>
              </div>
            ))}
          </div>
        </div>
        <div>
          <PluginHelp manifest={manifest} />
        </div>
      </div>
      {status === PluginStatus.UPDATE_AVAILABLE && (
        <div className="absolute bottom-10 right-10 bg-red shadow-red shadow-2xl-center rounded-full p-5">
          You have an older version installed: {installedPluginVersion}
        </div>
      )}
    </AuthenticatedPageContainer>
  );
}
