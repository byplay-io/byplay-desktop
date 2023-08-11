import {useDispatch, useSelector} from 'react-redux';
import {useCallback} from 'react';
import {
  type RecordingsListState,
  selectRecordingsView,
  setRecordingsView,
} from '../../../state/recordingsList';
import ViewGridIcon from '../assets/view-grid.svg';
import ViewListIcon from '../assets/view-list.svg';

export function RecordingListViewSelector() {
  const view = useSelector(selectRecordingsView);
  const dispatch = useDispatch();

  const setView = useCallback(
    (newView: RecordingsListState['view']) => {
      dispatch(setRecordingsView(newView));
    },
    [dispatch],
  );

  return (
    <div>
      <button
        type="button"
        className={`mx-2 view-button ${view === 'grid' ? 'active' : ''}`}
        onClick={() => {
          setView('grid');
        }}
      >
        <img src={ViewGridIcon} alt="grid" width={24} height={24} />
      </button>
      <button
        type="button"
        className={`rounded-r-full view-button ${
          view === 'list' ? 'active' : ''
        }`}
        onClick={() => {
          setView('list');
        }}
      >
        <img src={ViewListIcon} alt="grid" width={24} height={24} />
      </button>
    </div>
  );
}
