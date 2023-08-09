import axios, {type AxiosRequestConfig} from 'axios';
import {subscribeMainToRenderer} from './ipcCommunicationMain';
import {IPCChannel} from '../../types/ipc';

export function subscribeAxiosProxy() {
  subscribeMainToRenderer<AxiosRequestConfig, unknown>(
    IPCChannel.AXIOS_REQUEST,
    async (request) => {
      const res = await axios.request({...request, validateStatus: () => true});
      return {
        data: res.data,
        status: res.status,
        statusText: res.statusText,
        headers: res.headers,
      };
    },
  );
}
