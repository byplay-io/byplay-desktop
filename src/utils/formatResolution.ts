import {type RecordingManifestData} from '../types/byplayAPI';

export default function formatResolution(manifest: RecordingManifestData) {
  const {videoSettings} = manifest;
  const {width, height} = videoSettings?.screenResolution ?? {
    width: 0,
    height: 0,
  };
  if (width <= 0 || height <= 0) {
    return null;
  }
  if (videoSettings?.deviceRotation === 90) {
    return `${height}x${width}`;
  }
  return `${width}x${height}`;
}
