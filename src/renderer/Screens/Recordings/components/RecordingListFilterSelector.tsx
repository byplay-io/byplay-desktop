import {useDispatch, useSelector} from 'react-redux';
import {useCallback} from 'react';
import {
  type RecordingsListState,
  selectRecordingsFilter,
  selectRecordingsListCountsByFilterType,
  setRecordingsFilter,
} from '../../../state/recordingsList';

export default function RecordingListFilterSelector() {
  const currentFilter = useSelector(selectRecordingsFilter);
  const counts = useSelector(selectRecordingsListCountsByFilterType);
  const dispatch = useDispatch();
  const setFilter = useCallback(
    (newView: RecordingsListState['filter']) => {
      dispatch(setRecordingsFilter(newView));
    },
    [dispatch],
  );
  const buttons = [
    {
      label: 'All',
      filter: 'all',
    },
    {
      label: 'Downloaded',
      filter: 'extracted',
    },
    {
      label: 'Not Downloaded',
      filter: 'not_extracted',
    },
  ] as const;
  return (
    <div>
      {buttons.map(({label, filter}) => (
        <button
          type="button"
          key={filter}
          className={`mx-2 filter-button ${
            currentFilter === filter ? 'active' : 'not-active'
          }`}
          onClick={() => {
            setFilter(filter);
          }}
        >
          {label} ({counts[filter]})
        </button>
      ))}
    </div>
  );
}
