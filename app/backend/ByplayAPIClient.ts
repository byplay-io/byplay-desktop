import { AxiosResponse, default as axios } from 'axios';
import {
  IByplayAPIResponse,
  IByplayAPIResponseAuthTmpSignInCode,
  IByplayAPIResponseRecordingLinks, IByplayCheckTmpSignInCodeResponse,
  IRecordingsListResponse
} from '../types/byplayAPI';

type Resp<T> = Promise<IByplayAPIResponse<T>>

export default class ByplayAPIClient {
  private readonly getAccessToken: () => string | null
  baseUrl = "https://account.byplay.io"

  static instance: ByplayAPIClient

  constructor(getAccessToken: () => string | null) {
    this.getAccessToken = getAccessToken
  }

  async recordingLinks(recordingId: string): Resp<IByplayAPIResponseRecordingLinks> {
    let resp = await axios.get<any, AxiosResponse<IByplayAPIResponseRecordingLinks>>(
      this.makeUrl(`recordings/${recordingId}/links`),
      { headers: this.headers() }
    )
    return this.wrapSuccess(resp.data)
  }

  async recordingsList(): Resp<IRecordingsListResponse> {
    let resp = await axios.get<any, AxiosResponse<IRecordingsListResponse>>(
      this.makeUrl(`recordings`),
      { headers: this.headers() }
    )
    return this.wrapSuccess(resp.data)
  }

  async authCreateTmpSignInCode(): Resp<IByplayAPIResponseAuthTmpSignInCode> {
    let resp = await axios.post<any, AxiosResponse<IByplayAPIResponseAuthTmpSignInCode>>(
      this.makeUrl(`auth/tmp_sign_in_code`),
      {}
    )
    console.log("tmp sign in code resp", resp)
    return this.wrapSuccess(resp.data)
  }

  async authCheckTmpSignInCode(checkToken: string): Resp<IByplayCheckTmpSignInCodeResponse> {
    let resp = await axios.get<any, AxiosResponse<IByplayCheckTmpSignInCodeResponse>>(
      this.makeUrl(`auth/check_tmp_sign_in_code`),
      { headers: { 'x-check-token': checkToken } }
    )
    let respVal = resp.data as IByplayCheckTmpSignInCodeResponse | { error: string }
    if(respVal.error) {
      return {
        success: false,
        message: respVal.error,
        response: null
      }
    }
    return this.wrapSuccess(respVal as IByplayCheckTmpSignInCodeResponse)
  }

  private wrapSuccess<T>(resp: T): IByplayAPIResponse<T> {
    return {
      success: true,
      message: null,
      response: resp
    }
  }

  private headers() {
    let token = this.getAccessToken()
    if(!token) {
      throw "Access token is empty!"
    }
    return {
      'x-access-token': token
    }
  }

  private makeUrl(path: string) {
    return `${this.baseUrl}/api/standalone/${path}`
  }
}
