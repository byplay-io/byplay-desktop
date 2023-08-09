import OnboardingHeader from './components/OnboardingHeader';

function FolderSelector() {
  return (
    <div className="flex flex-row pt-10">
      <div className="bg-dark2 border-primary border-2 flex-grow font-mono flex-row p-4 rounded-2xl">
        /Users/username/Documents/Byplay
      </div>
      <div className="bg-primary border-primary border-2 ml-5 flex-row py-4 mr-4 px-8 rounded-2xl text-center">
        Select
      </div>
      <div className="border-primary border-2 text-primary flex-row ml-12 py-4 px-8 rounded-full text-center">
        Continue →
      </div>
    </div>
  );
}

export default function SelectDirectory() {
  return (
    <div className="flex flex-grow flex-col">
      <OnboardingHeader status="" />
      <div className="flex flex-col pt-10">
        <div className="helper-text font-bold">Step 2 of 2</div>
      </div>
      <h1>Select Directory</h1>
      <div className="w-1/2 leading-8">
        Select a directory where Byplay can store and extract the downloaded
        videos, FBX files and assets
        <div className="info text-light1">
          Remember, video frames take up a lot of space. Make sure you have{' '}
          <b>enough space on your hard drive</b>
        </div>
      </div>

      <FolderSelector />
    </div>
  );
}
