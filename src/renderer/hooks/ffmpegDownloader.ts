import {useDispatch, useSelector} from 'react-redux';
import {selectFfmpegPath} from '../state/ffmpeg';

export default function useFFMPEGDownloader() {
  const dispatch = useDispatch();
  const ffmpegPath = useSelector(selectFfmpegPath);
}
