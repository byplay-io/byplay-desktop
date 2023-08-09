import {IPCChannel} from '../types/ipc';

let reqCountRendererToMain = 0;

export async function sendRendererToMain<Req, Res>(
  channel: IPCChannel,
  request: Req,
): Promise<Res> {
  reqCountRendererToMain += 1;
  const result = await new Promise((resolve) => {
    const responseChannel = `response-${reqCountRendererToMain}`;
    window.electron.ipcRenderer.once(responseChannel, (response: object) => {
      resolve(response as Res);
    });
    window.electron.ipcRenderer.sendMessage(channel, {
      respondTo: responseChannel,
      request,
    });
  });
  return result as Res;
}

export const getAppVersion = async () =>
  sendRendererToMain<null, string>(IPCChannel.INFO_GET_APP_VERSION, null);

export const getPlatform = async () =>
  sendRendererToMain<null, string>(IPCChannel.INFO_GET_PLATFORM, null);
