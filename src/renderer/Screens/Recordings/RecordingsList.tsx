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

export function RecordingsList() {
  const {loading, reloadList} = useRecordingsList();

  const recordingsList = useSelector(selectRecordingsListFiltered);

  const parent = useAutoAnimate()[0];

  return (
    <AuthenticatedPageContainer>
      <div className="flex flex-row">
        <div className="bg-dark3 rounded-xl px-5 w-[700px]">
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
          <div className="flex flex-row justify-between">
            <RecordingListFilterSelector />
            <RecordingListViewSelector />
          </div>
          <div
            className="flex flex-row flex-wrap overflow-scroll pt-5 h-[800px]"
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
        <RecordingConsole />
      </div>
    </AuthenticatedPageContainer>
  );
}
