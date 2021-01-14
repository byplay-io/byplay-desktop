export interface RecordingManifestData {
  uuid: string
  effectUUID: string
  framesCount: number
  fps: number
  createdAtTimestamp: number
  recordingId: string
  hasAudio: boolean,
  videoSettings: {
    audioEnabled: boolean,
    autoFocusLocked: boolean,
    whiteBalanceLocked: boolean,
    deviceRotation: 0 | 90 | 180
  } | null
}

export interface IRecordingEntry {
  id: string,
  recordingManifest: RecordingManifestData,
  thumbnailUrl: string
}


export interface IByplayAPIResponseSuccess<T> {
  success: true,
  message: string | null,
  response: T
}

export interface IByplayAPIResponseError {
  success: false,
  message: string,
  response: null
}

export type IByplayAPIResponse<T> =
  IByplayAPIResponseSuccess<T> | IByplayAPIResponseError

export interface IByplayAPIResponseRecordingFile {
  path: string,
  link: string,
  size: number
}

export interface IByplayAPIResponseRecordingLinks {
  files: IByplayAPIResponseRecordingFile[]
}

export interface IByplayAPIResponseStatusOk {
  status: "ok"
}

export interface IByplayAPIResponseAuthTmpSignInCode {
  check_token: string,
  tmp_sign_in_code: string
}

export interface IRecordingsListResponse {
  processing_count: number,
  uploading_count: number,
  recordings: IRecordingEntry[]
}


export type IByplayCheckTmpSignInCodeResponse =
  { activated: false, error: null } |
  { activated: true, user_id: string, access_token: string, error: null }
