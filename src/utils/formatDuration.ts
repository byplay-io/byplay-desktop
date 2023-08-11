export default function formatDuration(framesCount: number, fps: number) {
  const duration = Math.round(framesCount / fps);
  const sec = (duration % 60).toString().padStart(2, '0');
  const min = Math.floor(duration / 60)
    .toString()
    .padStart(2, '0');
  return `${min}:${sec}`;
}
