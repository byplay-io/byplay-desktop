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

export function RecordingsList() {
  const {loading, reloadList} = useRecordingsList();

  const recordingsList = useSelector(selectRecordingsListFiltered);

  const [parent, enableAnimations] = useAutoAnimate();

  return (
    <div className="flex flex-row authorized-page-container">
      <div className="bg-dark3 w-[700px]">
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
          className="flex flex-row flex-wrap overflow-scroll h-[800px]"
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
  );
}
