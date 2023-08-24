import './RecordingsList.css';
import React, {useEffect} from 'react';
import {useSelector} from 'react-redux';
import {useAutoAnimate} from '@formkit/auto-animate/react';
import {useRecordingsList} from './hooks/recordingsList';
import {selectRecordingsListFiltered} from '../../state/recordingsList';
import {RecordingBox} from './components/RecordingBox';
import {RecordingListViewSelector} from './components/RecordingListViewSelector';
import RecordingListFilterSelector from './components/RecordingListFilterSelector';
import RefreshIcon from './assets/refresh-icon.svg';
import RecordingConsole from './components/RecordingConsole';
import AuthenticatedPageContainer from '../../components/AuthenticatedPageContainer';

function Header() {
  const {loading, reloadList} = useRecordingsList();

  return (
    <div>
      <h1 className="flex flex-row content-center">
        Videos
        <img
          src={RefreshIcon}
          alt="reload"
          className={`refresh-icon ml-4 ${loading ? 'refreshing' : ''}`}
          width={50}
          height={50}
          onClick={reloadList}
        />
      </h1>
    </div>
  );
}

export function ListWithFilters() {
  const recordingsList = useSelector(selectRecordingsListFiltered);
  const parent = useAutoAnimate()[0];

  return (
    <div className="flex flex-col flex-grow h-full">
      <div className="flex flex-row justify-between pb-5">
        <RecordingListFilterSelector />
        <RecordingListViewSelector />
      </div>
      <div className="flex flex-grow pr-2 relative" ref={parent}>
        <div
          className="absolute top-0 bottom-0 left-0 right-0 flex flex-row flex-wrap overflow-y-scroll pr-2"
          ref={parent}
        >
          {recordingsList.map(({id, recordingManifest, thumbnailUrl}) => (
            <RecordingBox
              key={id}
              id={id}
              recordingManifest={recordingManifest}
              thumbnailUrl={thumbnailUrl}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export function RecordingsList() {
  return (
    <AuthenticatedPageContainer>
      <div className="bg-dark3 rounded-xl px-5 w-full h-full flex flex-col">
        <Header />
        <div className="flex flex-row flex-grow w-full">
          <ListWithFilters />
          <RecordingConsole />
        </div>
      </div>
    </AuthenticatedPageContainer>
  );
}
