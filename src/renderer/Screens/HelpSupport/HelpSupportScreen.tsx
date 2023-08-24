import AuthenticatedPageContainer from '../../components/AuthenticatedPageContainer';
import DiscordIcon from './assets/discord.svg';

export default function HelpSupportScreen() {
  return (
    <AuthenticatedPageContainer>
      <h1>Help & Support</h1>
      <div>
        Check out the{' '}
        <a
          className="external-link"
          href="https://docs.byplay.io"
          target="_blank"
          rel="noreferrer"
        >
          Docs section
        </a>{' '}
        on our website
      </div>

      <div className="flex flex-row">
        <div className="mt-5">
          Questions or issues? Shoot an email at{' '}
          <a className="external-link" href="mailto:vadim@byplay.io">
            vadim@byplay.io
          </a>
        </div>
      </div>

      <div className="mt-10">
        Want to chat, share your work, or get help from other users?
        <a
          href="https://discord.gg/Ru8YqFafQD"
          target="_blank"
          className="big-primary-button mt-5"
          rel="noreferrer"
        >
          <img src={DiscordIcon} alt="discord" />
          Join our Discord
        </a>
      </div>
    </AuthenticatedPageContainer>
  );
}
