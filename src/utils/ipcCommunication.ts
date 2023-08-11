import {IPCChannel} from '../types/ipc';

let reqCountRendererToMain = 0;

export function subscribeRenderFromMain<Msg>(
  channel: string,
  handler: (request: Msg) => void,
) {
  return window.electron.ipcRenderer.on(channel, (msg) => {
    handler(msg as Msg);
  });
}

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
    console.log('sending to main', channel, request);
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
