import {type AxiosRequestConfig, type AxiosResponse} from 'axios';
import {
  type IByplayAPIResponse,
  type IByplayAPIResponseAuthTmpSignInCode,
  type IByplayAPIResponseRecordingLinks,
  type IByplayCheckTmpSignInCodeResponse,
  type IRecordingsListResponse,
} from '../../types/byplayAPI';
import {sendRendererToMain} from '../../utils/ipcCommunication';
import {IPCChannel} from '../../types/ipc';

type Resp<T> = Promise<IByplayAPIResponse<T>>;

export async function makeRequest<T>(req: AxiosRequestConfig) {
  const res = await sendRendererToMain<AxiosRequestConfig, AxiosResponse<T>>(
    IPCChannel.AXIOS_REQUEST,
    req,
  );
  return res;
}

export default class ByplayAPIClient {
  private readonly token: string | null;
  baseUrl = 'https://account.byplay.io';

  constructor(token: string | null) {
    this.token = token;
  }
  //
  // async recordingDelete(recordingId: string): Resp<IByplayAPIResponseStatusOk> {
  //   const resp = await axios.delete<
  //     any,
  //     AxiosResponse<IByplayAPIResponseStatusOk>
  //   >(this.makeUrl(`recordings/${recordingId}`), {
  //     headers: this.headers(),
  //     withCredentials: false,
  //   });
  //   return ByplayAPIClient.wrapSuccess(resp.data);
  // }

  async recordingLinks(
    recordingId: string,
  ): Resp<IByplayAPIResponseRecordingLinks> {
    const resp = await makeRequest<IByplayAPIResponseRecordingLinks>({
      url: this.makeUrl(`recordings/${recordingId}/links`),
      headers: this.headers(),
      method: 'GET',
    });
    return ByplayAPIClient.wrapSuccess(resp.data);
  }

  async recordingsList(): Resp<IRecordingsListResponse> {
    const resp = await makeRequest<IRecordingsListResponse>({
      url: this.makeUrl(`recordings`),
      headers: this.headers(),
      method: 'GET',
    });
    return ByplayAPIClient.wrapSuccess(resp.data);
  }

  async authCreateTmpSignInCode(): Resp<IByplayAPIResponseAuthTmpSignInCode> {
    const resp = await makeRequest<IByplayAPIResponseAuthTmpSignInCode>({
      url: this.makeUrl(`auth/tmp_sign_in_code`),
      method: 'POST',
    });
    return ByplayAPIClient.wrapSuccess(resp.data);
  }

  async authCheckTmpSignInCode(
    checkToken: string,
  ): Resp<IByplayCheckTmpSignInCodeResponse> {
    const resp = await makeRequest<IByplayCheckTmpSignInCodeResponse>({
      url: this.makeUrl(`auth/check_tmp_sign_in_code`),
      headers: {'x-check-token': checkToken},
      method: 'GET',
    });

    const respVal = resp.data as
      | IByplayCheckTmpSignInCodeResponse
      | {error: string};
    if ('error' in respVal && respVal.error !== null) {
      return {
        success: false,
        message: respVal.error,
        response: null,
      };
    }
    return ByplayAPIClient.wrapSuccess(respVal);
  }

  // async sendFeedback(text: string, extra: any) {
  //   console.log('Sending feedback', text);
  //   const res = await axios.post<any, AxiosResponse<'ok'>>(
  //     this.makeUrl(`feedback`),
  //     {text, extra},
  //     {headers: this.headers(true), withCredentials: false},
  //   );
  //   console.log(res);
  // }

  private static wrapSuccess<T>(resp: T): IByplayAPIResponse<T> {
    return {
      success: true,
      message: null,
      response: resp,
    };
  }

  private headers(allowEmptyToken = false) {
    if (this.token === null) {
      if (!allowEmptyToken) {
        throw new Error('Access token is empty!');
      }
    }
    return {
      'x-access-token': this.token ?? '-',
    };
  }

  private makeUrl(path: string) {
    return `${this.baseUrl}/api/standalone/${path}`;
  }
}
