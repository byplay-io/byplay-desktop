export default function OnboardingHeader(props: {status: string | null}) {
  const {status} = props;
  return (
    <div className="w-full flex flex-row justify-between pb-5">
      <div className="font-mono text-primary">{status}</div>
      <div>Byplay logo</div>
    </div>
  );
}
