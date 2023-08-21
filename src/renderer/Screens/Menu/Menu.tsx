import {useLocation, useNavigate} from 'react-router-dom';
import {useSelector} from 'react-redux';
import {AppRoute} from '../routes';
import {HelpIcon, HomeIcon, PluginsIcon, SettingsIcon} from './Iconts';
import {selectRecordingsDirPath} from '../../state/recordings';
import {selectAccessToken} from '../../state/auth';

function MenuItem(props: {
  name: string;
  link: string;
  children: React.ReactNode;
}) {
  const path = useLocation();

  const {name, link, children} = props;
  const active = path.pathname.startsWith(link);
  const navigate = useNavigate();
  return (
    <a
      className={`flex flex-row menu-item ${active ? 'active' : ''}`}
      onClick={() => {
        navigate(link);
      }}
    >
      <div className="menu-collapsed-width flex flex-col items-center">
        {children}
      </div>
      <div className="text-xl ml-3">{name}</div>
    </a>
  );
}

export default function Menu() {
  const path = useLocation();
  if (path.pathname.startsWith('/onboarding')) {
    return null;
  }

  return (
    <div className="menu-container">
      <div className="menu-expanded-width">
        <MenuItem name="Home" link={AppRoute.RECORDINGS_LIST}>
          <HomeIcon />
        </MenuItem>
        <MenuItem name="Plugins" link={AppRoute.PLUGINS}>
          <PluginsIcon />
        </MenuItem>
        <MenuItem name="Help & Support" link={AppRoute.HELP_SUPPORT}>
          <HelpIcon />
        </MenuItem>
        <MenuItem name="Settings" link={AppRoute.SETTINGS}>
          <SettingsIcon />
        </MenuItem>
      </div>
    </div>
  );
}
