import Logo from '../assets/icon_256_masked.png';

export default function OnboardingHeader(props: {status: string | null}) {
  const {status} = props;
  return (
    <div className="w-full flex flex-row justify-between pb-5">
      <div className="font-mono text-primary">{status}</div>
      <img src={Logo} className="w-10 h-10" />
    </div>
  );
}
