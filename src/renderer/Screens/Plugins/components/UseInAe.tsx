export default function UseInAe() {
  return (
    <div className="mt-8">
      <h3>Use in AfterEffects</h3>
      <ol className="list-marker">
        <li>
          In each recording folder you will find a <b>.jsx</b> file
        </li>
        <li>
          Open your AfterEffects project and import it with{' '}
          <b>File → Scripts → Run Script File</b>
        </li>
        <li>
          Drag <b>src_video.mp4</b> from the recording folder to the composition
        </li>
        <li>Done!</li>
      </ol>
    </div>
  );
}
