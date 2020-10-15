import Ffmpeg, { Codecs } from 'fluent-ffmpeg';

export default class FFMPEGWrapper {
  constructor(ffmpegPath: string) {
    Ffmpeg.setFfmpegPath(ffmpegPath)
  }

  async isWorking(): Promise<boolean> {
    await this.getCodecs()
    return true
  }

  getCodecs(): Promise<Codecs>  {
    return new Promise<Codecs>((resolve, reject) =>
      Ffmpeg.getAvailableCodecs((err: Error, codecs: Codecs) => {
        if(codecs) {
          resolve(codecs)
        } else {
          reject(err)
        }
      })
    )
  }

  async extract(videoPath: string, framesPath: string, onProgress: (processedFrames: number) => void) {
    return new Promise(resolve => {
      Ffmpeg(videoPath)
        .addOption("-vsync 0")
        .addOutput(framesPath)
        .on('end', resolve)
        .on('progress', function(progress) {
          onProgress(progress.frames || 0)
        })
        .run()
    })
  }
}
