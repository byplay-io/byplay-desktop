import OnboardingHeader from './components/OnboardingHeader';
import useTmpSignInCode from './hooks/useTmpSignInCode';

function AuthCode() {
  const code = useTmpSignInCode();
  return (
    <div className="text-3xl font-mono text-primary ml-4">
      {code === null ? 'loading...' : code.code}
    </div>
  );
}

export default function AuthenticateScreen() {
  return (
    <div className="flex flex-grow flex-col mx-10">
      <OnboardingHeader status="waiting to authenticate" />
      <div className="flex flex-col pt-10">
        <div className="helper-text font-bold">Step 1 of 2</div>
      </div>
      <h1>Authenticate</h1>
      <div className="w-1/2 leading-8">
        Easily link your Byplay Camera account with the desktop app and access
        your videos instantly.
      </div>

      <ol className="list-decimal">
        <li className="list-marker">Open the Byplay Camera app</li>
        <li className="list-marker">
          Go to <span className="text-primary font-bold">gallery</span> on the
          bottom right
        </li>
        <li className="list-marker">
          Tap on the{' '}
          <span className="text-primary font-bold">Connect to Desktop</span>{' '}
          button
        </li>
        <li className="list-marker">Enter the code below:</li>
      </ol>

      <AuthCode />
    </div>
  );
}
