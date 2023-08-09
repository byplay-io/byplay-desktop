import {ipcMain} from 'electron';
import {type IPCChannel} from '../../types/ipc';

export function subscribeMainToRenderer<Req, Res>(
  channel: IPCChannel,
  handler: (request: Req) => Promise<Res>,
) {
  ipcMain.on(channel, async (event, {respondTo, request}) => {
    const response = await handler(request);
    event.sender.send(respondTo, response);
  });
}
